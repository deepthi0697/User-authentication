const Booking = require('../models/Booking')
const pick = require('lodash/pick')

module.exports.list = (req, res) => {
    Booking.listBookings(req.user)
        .then((bookings) => {
            res.json(bookings)
        })
        
}

module.exports.create = (req, res) => {
   // const body = req.body
   const body = pick(req.body, ['_id', 'startDate', 'endDate'])
    const booking = new Booking(body)
    booking.user = req.user._id
    booking.save()
        .then((booking) => {
            res.json({
                booking,
                notice: 'Successfully created booking'
            })
        })
}

module.exports.show = (req, res) => {
    const id = req.params.id
    Booking.showBooking(req.user, id)
        .then((booking) => {
            if(booking){
                if(!booking){
                    res.json({})
                }
                res.json(booking)
            }else {
                res.json({})
            }
            
        })
}


module.exports.update = (req, res) => {
    const id = req.params.id
    Booking.updateBooking(req.user, req.body, id)
        .then((booking) => {
            if(!booking){
                res.json({})
            }
            res.json(booking)
        })
        .catch((err) => {
            res.json(err)
        })
}


module.exports.destroy = (req, res) => {
    const id = req.params.id
    Booking.destroyBooking(req.user, id)
        .then((booking) => {
            if(!booking){
                res.json({})
            }
            res.json(booking)
        })
}


