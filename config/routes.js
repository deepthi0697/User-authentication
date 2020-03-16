const bookingsController = require('../app/controllers/BookingsController')
const express = require('express')
const router = express.Router()
const {authenticateUser, checkAllowAccess} = require('../app/middlewares/authentication')

router.get('/bookings', authenticateUser, checkAllowAccess, bookingsController.list)
router.post('/bookings', authenticateUser, checkAllowAccess, bookingsController.create)
router.get('/bookings/:id',authenticateUser, checkAllowAccess, bookingsController.show)
router.put('/bookings/:id', authenticateUser, checkAllowAccess, bookingsController.update)
router.delete('/bookings/:id', authenticateUser, checkAllowAccess, bookingsController.destroy)

module.exports = router
