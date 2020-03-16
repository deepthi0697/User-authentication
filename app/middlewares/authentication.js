const {User} = require('../models/User')

const authenticateUser = function (req, res, next) {
    const token = req.header('x-auth')
    User.findByToken(token)
        .then((user) => {
            if(user){
                req.user = user
                req.token = token
                next()
            } else {
                res.status('401').send('token is unavailable')
            }
           
        })
        .catch((err) => {
            res.status('401').send(err)
        })
}

const authoriseUser = function(req, res, next){
    if(req.user.role == 'admin'){
        next()
    } else {
        res.status('404').json({
            notice: "page youre looking for does not exist"
        })
    }
}

const checkAllowAccess = function(req, res, next){
    if(req.user.allowAccess){
        next()
    } else {
        res.status('403').json({ //403 - forbidded
            notice: "you're not allowed to login. Email the admin"
        })
    }
}
module.exports = {
    authenticateUser,
    authoriseUser,
    checkAllowAccess
}