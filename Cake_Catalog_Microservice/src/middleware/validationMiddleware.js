const {validationResult}=require("express-validator");

const validateRequest=(req,res,next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).send({message:"Validation failed",errors:error.array()});
    }

    next();
}

module.exports=validateRequest;