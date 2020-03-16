const jwt = require('jsonwebtoken')

const tokenData = {
    id: 1,
    name: "user1"
}

const token = jwt.sign(tokenData, 'jwt123')
console.log(token)