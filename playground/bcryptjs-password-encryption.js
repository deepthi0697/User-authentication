const bcryptjs = require('bcryptjs')

const password = 'secret123'

bcryptjs.genSalt(10)
    .then((salt) => {
        bcryptjs.hash(password, salt)
            .then((encryptedPassword) => {
                console.log(encryptedPassword)
            })
    })