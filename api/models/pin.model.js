import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    location: {
        lat: { 
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        },
        info: {
            title: String,
            description: String,
            category: String
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'in-progress', 'resolved', 'deleted'],
            default: 'pending'
        }
    }
}, {timestamps: true});

const Pin = mongoose.model('Pin', pinSchema);

export default Pin;