import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import {User} from "../models/users.model.js"

const generateAccessAndRefresh=async(userId)=>{
    try {
        const user=await User.findById(userId);

        const accessToken=user.generateAccessToken()
    
        const refreshToken=user.generateRefreshToken()
       
    
        //store refresh token in db
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false}); //bina validation ke save krdo

        return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(500,"Error in generating tokens");
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    const {fullname,username,email,password}=req.body || {}
    
    if(
        [fullname,username,email,password].some((field)=>field?.trim()==="")
    ){
            throw new ApiError(400,"All fields are required")
    }

    if(password.length<6){
        throw new ApiError(400,"Password should have atleast 6 characters")
    }

    const existedUser=await User.findOne({
        $or:[
                { username: username.toLowerCase() },
                { email: email.toLowerCase() }
            ]

    })

    if(existedUser){
        throw new ApiError(400,"User exist with these email or username")
    }
    let profileImageData={}

    const profileImageLocalPath=req.file?.path;

    if(profileImageLocalPath){
        const profileImage=await uploadOnCloudinary(profileImageLocalPath,"profiles");

        if(!profileImage){
            throw new ApiError(400,"Error in uploading avatar image")
        }
        profileImageData={
            url:profileImage.url,
            public_id:profileImage.public_id
        }
    }
    
    let user;

    try {
            user=await User.create({
            fullname,
            username:username.toLowerCase(),
            email:email.toLowerCase(),
            password,
            profileImage:profileImageData  
            })
        } 
    catch (error) {
            await deleteFromCloudinary(profileImage.public_id)
            throw new ApiError(400,"User not created")
        }


    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    ) 

    return res
    .status(201)
    .json(
        new ApiResponse(201,createdUser,"User created successfully")
    )
})

const loginUser=asyncHandler(async (req,res)=>{
    const {email,username,password}=req.body

    if(!email && !username){
        throw new ApiError(400,"Email or username required to login")
    }

    const user=await User.findOne({
        $or:[{email},{username}]
    })

    if(!user){
        throw new ApiError(400,"user does not exist")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(400,"invalid credentials")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefresh(user._id)

    const loggedInUser=await User.findById(user._id).select(" -password -refreshToken ");

    const options={
        httpOnly:true,
        secure:true
   }
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)  
   .json(
    new ApiResponse(
        200,
        {user:loggedInUser,accessToken,refreshToken}, 
        "User logged in successfully"
    )
   )
})

const getCurrentUser=asyncHandler(async (req,res)=>{
    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                req.user,
                "USer details fetched"
            )
        )
})

export {
    registerUser,
    loginUser,
    getCurrentUser,
    
}