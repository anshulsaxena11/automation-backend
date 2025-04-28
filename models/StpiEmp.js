const mongoose = require('mongoose');

const stpiEmp = new mongoose.Schema({
    centre:String,
    empid:{
        type:String,
        unique:true
    },
    ename:String,
    egender:String,
    edesg:String,
    elvl:String,
    etpe:String,
    edob:String,
    doij:String,
    stat:String,
    email:String,
    edocj:String,
    dir:String,
    StatusNoida:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
})

const stpiEmpDetails = mongoose.model("stpiEmp",stpiEmp);

module.exports = stpiEmpDetails;