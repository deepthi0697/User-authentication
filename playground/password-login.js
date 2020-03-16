const bcryptjs = require('bcryptjs')

const encryptedPass = '$2a$10$DCwROAI7acl2Z.Nc7yi/4.9hi4iqyTkEdXmLoIDxCEgjVMP8SC/5W'
const pass = 'secret1'

bcryptjs.compare(pass, encryptedPass)
    .then((result) => {
        console.log(result) // will return bool true or false
    })