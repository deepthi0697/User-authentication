const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookingSchema = new Schema({
    title: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirmedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

bookingSchema.statics.listBookings = function(user){
    const Booking = this
    if(user.role === 'admin'){
        return Booking.find()
    } else {
        return Booking.find({user: user._id})
    }
}

bookingSchema.statics.showBooking = function(user, id){
    const Booking = this
    if(user.role == 'admin'){
        return Booking.findById(id)
    } else {
        return Booking.findOne({user: user._id, _id: id})
    }
}

bookingSchema.statics.updateBooking = function(user, body, id){
    const Booking = this
    if(user.role == 'admin'){
       // const updateBody = Object.assign({},body, {confirmedBy:user._id})
       const updateBody = {...body, ...{confirmedBy: user._id}} 
        return Booking.findByIdAndUpdate(id, updateBody, {
            runValidators: true, new: true
        })
    } else {
        return Booking.findByOneAndUpdate({_id:id, user: user._id}, pick(body,['title', 'startDate', 'endDate']))
    }
}

bookingSchema.statics.destoyBooking = function(user, id){
    const Booking = this
    if(user.role == 'admin'){
        return Booking.findByIdAndDelete(id)
    } else {
        return Booking.findOneAndDelete({_id: id,
        user: user._id})
    }
}

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking
