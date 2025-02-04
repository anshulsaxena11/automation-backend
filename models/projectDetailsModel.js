const mongoose = require('mongoose');

const projectDetailsSchema = new mongoose.Schema({
    orginisationName:String,
    projectName: String,
    startDate:{type:Date, default:null},
    endDate:{type:Date, default:null},
    projectType: [{
        type: mongoose.Schema.Types.ObjectId, 
      }],
    
    projectValue:String,
    primaryPersonName:String,
    secondaryPersonName:String,
    primaryPersonPhoneNo:String,
    secondaryPrsonPhoneNo: String,
    primaryPersonEmail:String,
    secondaryPersonEmail:String,
    directrate:String,
    serviceLocation:String,
    workOrder:String,
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

const ProjectDetails = mongoose.model('ProjectDetails', projectDetailsSchema);

module.exports = ProjectDetails;