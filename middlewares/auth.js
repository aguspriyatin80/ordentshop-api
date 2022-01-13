const {verify} = require('../helpers/auth-jwt')
const authentication = (req, res, next)=>{
    const headerToken = req.headers.authorization
    
    if(headerToken){
        const token = headerToken.split(" ")[1]
        const payload = verify(token)
        req.user = payload
        next()
    } else {
        throw new Error('Unauthenticated')
    }
}
const authorization = (...roles) => (req,res,next)=> {
    
    if(roles.includes(req.user.role)) {
        next()
    } else {
        throw new Error('forbidden')
    }
    
}

module.exports = {authentication, authorization}