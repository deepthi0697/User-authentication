const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique:true,
        //custom validate property provided by mongoose
        validate: {
            validator: function(value){  //in model we cant' use es6 arrow function, 
                return validator.isEmail(value)
            },
            message: function(){
                return 'invalid email format'
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128
    },
    tokens: [ // everytime user logs in from different systems token get stored in this array of tokens
        {
            token: {
                type: String
            },
            createdAt : {
               type: Date,
               default: Date.now() 
            }
        }
    ],
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    allowAccess: {
        type: Boolean,
        default: true
    }
})

// pre hook - model - middlewares
userSchema.pre('save', function(next){ // here it has to be es5 function, because if we use arrow function this will indicate to empty {}

    const user = this // here this will be reffering to user object. user.save()
    if(user.isNew){
        bcryptjs.genSalt(10)
        .then((salt) => { //1st 29 characters of the encrypted password is salt value that was used for encryption
            bcryptjs.hash(user.password, salt)
                .then((encryptedPassword) => {
                    user.password = encryptedPassword
                    next() // in mongoose after next(), next middleware funtn will be called, but in express it calls next function
                })
        })
    } else {
        next()
    }
    
})


//own static method - statics
//this particular method will be returning promise object
//searches - is always a static method
userSchema.statics.findByCredentials = function(email, password){
    const User = this // User is model name
    return User.findOne({email: email})
        .then((user) => {
            if(!user){ // not of null is true
                return Promise.reject('invalid email / password')

            }
            return bcryptjs.compare(password, user.password) // salt in encrypted passord is applied on the password, same salt in the string gives same encrypted string
                .then((result) => {
                    if(result){
                        return Promise.resolve(user)
                    } else {
                        return Promise.reject(err)
                    }
                    
                })
                .catch((err) => {
                    return Promise.reject('invalid email / password')
                })
        })

        .catch((err) => {
            return Promise.reject(err)
            // return new Promise(function(response, reject){
            //     reject(err)
            // })
        })
} 


userSchema.statics.findByToken = function(token){
    const User = this
    let tokenData

    try {
        tokenData = jwt.verify(token, 'jwt@123')
    } catch(err){
        return Promise.reject(err)
    }

    return User.findOne({
        _id: tokenData._id,
        'tokens.token': token // here we're writing it inside a string, because it becomes syntax error & also because it has spl char.
    })
        .then((user) => {
            return Promise.resolve(user)
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}

//own instance method - methods
userSchema.methods.generateToken = function(){
    const user = this //here user is variable (.then((user)))

    const tokenData = {
        _id: user._id,
        username: user.username,
        createdAt: Number(new Date())
    }

    const token = jwt.sign(tokenData, 'jwt@123')
    user.tokens.push({token: token})

    return user.save()
        .then(function(user)  {
            return Promise.resolve(token) // if we want to resolve both token and user, pass it in the object({user, token})
        })
        .catch(function(err) {
            return Promise.reject(err)
        })
}

const User = mongoose.model('User', userSchema)


module.exports = {
    User
}