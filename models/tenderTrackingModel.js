const mongoose = require('mongoose');

const TenderTrackingSchema = new mongoose.Schema({
    tenderName:String,
    organizationName:String,
    state:String,
    taskForce:String,
    valueINR:String,
    status:String,
    tenderDocument:String,
    lastDate:{type:Date, default:null},
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

const TenderTrackings = mongoose.model('TenderTracking', TenderTrackingSchema);

module.exports = TenderTrackings;