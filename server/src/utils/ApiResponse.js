class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode;
        this.data=data;
        this.message=message;
        this.success=statusCode < 400; //if status code is less than 400 then success else false
    }
}
export default ApiResponse;