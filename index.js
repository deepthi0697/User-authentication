const express = require('express')
const {setupDB} = require('./config/database')
const {usersRouter} = require('./app/controllers/UsersController')
const app = express()
const PORT = 3034
const router = require('./config/routes')

app.use(express.json())
app.use('/users', usersRouter)
app.use('/', router)
setupDB()

app.listen(PORT, () => {
    console.log('listening on port', PORT)
})