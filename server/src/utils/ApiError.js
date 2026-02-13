class ApiError extends Error {
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message); //overwrite messsage
        this.statusCode=statusCode;
        this.data=null; //make Consistent API response
        this.message=message;
        this.success=false;
        this.errors=errors;
 
        // api error ki big file issi stack trace file pr hai batata hai yaha yaha dikkat hai A stack trace tells you, Where the error happened,Which functions were call,In what order
        if(stack){
            this.stack=stack; //Preserve original error context
        }else{
            Error.captureStackTrace(this,this.constructor); //Generate clean stack trace
        }
    }
}

export default ApiError;