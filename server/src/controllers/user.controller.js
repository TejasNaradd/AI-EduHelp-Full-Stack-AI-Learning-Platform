import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import {User} from "../models/users.model.js"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax"
};

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
            profileImage:profileImageData,
            authProvider:"local"
            })
        } 
    catch (error) {
            await deleteFromCloudinary(profileImageData.public_id)
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
    if(user.authProvider==="google"){
        throw new ApiError(400,"Login in via google")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(400,"invalid credentials")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefresh(user._id)

    const loggedInUser=await User.findById(user._id).select(" -password -refreshToken ");

   return res
   .status(200)
   .cookie("accessToken",accessToken,cookieOptions)
   .cookie("refreshToken",refreshToken,cookieOptions)  
   .json(
    new ApiResponse(
        200,
        {user:loggedInUser,accessToken,refreshToken}, 
        "User logged in successfully"
    )
   )
})

const googleLogin=asyncHandler(async(req,res)=>{

    const { idToken } = req.body
    if(!idToken){
        throw new ApiError(400,"Google token required")
    }

    // verify token with Google
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()

    const { sub, email, name, picture } = payload

    let user = await User.findOne({ email })

    // EXISTING USER → LOGIN
    if(user){
        const {accessToken,refreshToken}=await generateAccessAndRefresh(user._id)

        const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

        return res
        .status(200)
        .cookie("accessToken",accessToken,cookieOptions)
        .cookie("refreshToken",refreshToken,cookieOptions)
        .json(new ApiResponse(
            200,
            {user:loggedInUser,accessToken,refreshToken},
            "Google login success"
        ))
    }

    // NEW USER → CREATE
    const username = email.split("@")[0] + Math.floor(Math.random()*1000)

    user = await User.create({
        fullname:name,
        email,
        username,
        googleId:sub,
        authProvider:"google",
        profileImage:{ url:picture }
    })

    const {accessToken,refreshToken}=await generateAccessAndRefresh(user._id)

    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken",accessToken,{httpOnly:true,secure:true})
    .cookie("refreshToken",refreshToken,{httpOnly:true,secure:true})
    .json(new ApiResponse(
        200,
        {user:createdUser,accessToken,refreshToken},
        "Google signup success"
    ))
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

const logout=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $unset:{ 
                refreshToken:1 
            }
        },{
            new:true 
        }
    )

    const options={
    httpOnly:true, 
    secure:true
   }
   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged out successfully"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
   const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized request")
   }

    try {
        const decodeToken=jwt.verify(
            incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET
        )  
    
       const user=await User.findById(decodeToken?._id)
       if(!user){
        throw new ApiError(401,"Invalid refresh Token")
       }
  
       if(incomingRefreshToken!==user?.refreshToken){
        throw new ApiError(401,"Invalid refresh is expired or used");
       }
    
       const options={
        httpOnly:true,
        secure:true
       }
    
       const {accessToken,refreshToken}=await generateAccessAndRefresh(user._id)
       return res
       .status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",refreshToken,options)  
       .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken},
            "Access token refreshed successfully"
        )
       )
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid refresh token")
    }
})

const updateProfile = asyncHandler(async (req, res) => {

    const { fullname, email } = req.body;

    if (!fullname && !email && !req.file) {
        throw new ApiError(400, "no update fields provided");
    }

    const user = await User.findById(req.user._id)
    if (user.authProvider === "google" && email) {
        throw new ApiError(400, "Google account email cannot be changed")
    }

    let profileImageData;
    const oldImage = req.user.profileImage;
    const imagePath = req.file?.path;

    if (imagePath) {
        const updated = await uploadOnCloudinary(imagePath, "profiles"); 

        if (!updated) {
            throw new ApiError(400, "Error in uploading profile image");
        }

        profileImageData = {
            url: updated.url,
            public_id: updated.public_id
        };
    }

    const updateFields = {}

    if (fullname) {
        updateFields.fullname = fullname.trim()
    }

    if (email) {
        updateFields.email = email.trim().toLowerCase()
    }

    if (profileImageData) {
        updateFields.profileImage = profileImageData;
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        {new:true}
    ).select("-password");

    if (profileImageData && oldImage?.public_id) {
        await deleteFromCloudinary(oldImage.public_id);
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedUser, "User details updated")
    );
});

const updatePassword=asyncHandler(async(req,res)=>{
    const {oldpassword,newpassword}=req.body

    const user=await User.findById(req.user?._id)

    if(user.authProvider === "google"){
        throw new ApiError(400,"Google accounts do not have password")
    }


    const isPass=await user.isPasswordCorrect(oldpassword)

    if(!isPass){
        throw new ApiError(400,"Incorrect old password")
    }
    if(newpassword.length<6){
        throw new ApiError(400,"password must contains atleast 6 characters")
    }
    user.password=newpassword

    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Password updated succesfully")
    )
})


export {
    registerUser,
    loginUser,
    getCurrentUser,
    logout,
    refreshAccessToken,
    updateProfile,
    updatePassword,
    googleLogin,
}