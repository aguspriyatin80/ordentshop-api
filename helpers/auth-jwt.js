require('dotenv').config()
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

const generate = (payload)=>{
    try{
        const token = jwt.sign(payload, secret,{            
            algorithm: 'H256',
            issuer:'aguspriyatin',
            audience:[payload.email,payload.role]
        })
        return token
    } catch(err){
        next(err)
    }
}

const verify = (token) =>{
    return jwt.verify(token, secret)
}
module.exports = {generate, verify}