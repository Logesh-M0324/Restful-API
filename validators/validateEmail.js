const validateEmail = (email)=>{
    const validMail = email.match("/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/");
    return validMail;
}
module.exports = validateEmail;