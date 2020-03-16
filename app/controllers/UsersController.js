const express = require('express')
const Router = express.Router()
const { User} = require('../models/User')
const { authenticateUser, authoriseUser} = require('../middlewares/authentication')
//const bcryptjs = require('bcryptjs')
const pick = require('lodash/pick')

//localhost3000:/users/register
Router.post('/register', (req, res) => {
    const body = req.body
    const user = new User(body)
    //console.log(user.isNew) //true
    user.save()
        .then((user) => {
            //console.log(user.isNew) //false
            //res.send(pick(user,['_id', 'username', 'email']))
            res.json(user)
            //return user.generateToken()
        })
        .catch((err) => {
            res.send(err)
        })
})



//localhost3000:/users/login
Router.post('/login', (req, res) => {
    const body = req.body
    User.findByCredentials(body.email, body.password)
        .then((user) => {
            return user.generateToken()
        })
        .then((token) => {
            res.setHeader('x-auth', token).send({})
        })
        .catch((err) => {
            res.send(err)
        })

    // User.findOne({email: body.email})
    //     .then((user) => {
    //         if(!user){
    //             res.status('404').send('invalid email/password')
    //         }

    //         bcryptjs.compare(body.password, user.password)
    //         .then((result) => {
    //             if(result){
    //                 res.send(user)
    //             }else {
    //                 res.status('404').send('invalid email/password')
    //             }
    //         })

    //     })

    //     .catch((err) => { // catching error for async, 
    //         res.send(err)
    //     })

})

//localhost:3000//users/account
Router.get('/account', authenticateUser, (req,res) => {
    const { user } = req
   res.send('user')
    
})

//localhost3000:/users/logout
Router.delete('/logout', authenticateUser, (req,res) => {
    const {user , token} = req
    User.findByIdAndUpdate(user._id, { $pull : {tokens: {token: token}}}) // $pull is an aggregator method & it pulls that token from array of tokens. Aggregatotors can be called on static methods only. hence we're pushing it separately while adding it.

        .then(function(){
            res.send({notice: 'successfully logged out'})
        })
        .catch((err) => {
            res.json(err)
        })

})

Router.post('/add_user', authenticateUser, authoriseUser, (req, res) => {
    const body = pick(req.body, ['name', 'email', 'password', 'role'])
    const user = new User(body)
    user.save()
    .then((user) => {
        res.json(user)
    })
    .catch((err) => {
        res.json(err)
    })
})

Router.put('/grant_access', authenticateUser, authoriseUser, (req, res) => {
    const userId = req.query.userId
    User.findById(userId)
        .then(user => {
            user.allowAccess = !user.allowAccess
            user.save()
            .then((user) =>
            res.json({user,
                    notice: "access has been updated"}))
        })
})
module.exports = {
    usersRouter: Router
}