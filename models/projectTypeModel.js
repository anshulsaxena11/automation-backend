const mongoose = require('mongoose');

const ProjectTypeSchema = new mongoose.Schema({
 ProjectTypeName:{
    type:String,
    required:true,
    unique:true
  },
 createdAt:{
    type: Date,
    default: Date.now,
  },
})

const ProjectType = mongoose.model("ProjectType",ProjectTypeSchema);

module.exports = ProjectType;