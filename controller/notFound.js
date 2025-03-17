const notFound  = (req,res,next)=>{
    res.code = 400;
    res.status(404).json({code:404, status:false, message:"page not Found"});
}

module.exports = notFound;