import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    destination: String,
    days:String,
    persons:String,
    message: String,
    type:String,
    fullName:String,
    email:String,
    phone:String,
    tripName:String,
    type:String,
    tripType: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
