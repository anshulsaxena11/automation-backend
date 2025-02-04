const mongoose = require('mongoose');

const ProjectTypeSchema = new mongoose.Schema({
 ProjectTypeName:String,
 createdAt:{
    type: Date,
    default: Date.now,
  },
})

const ProjectType = mongoose.model("ProjectType",ProjectTypeSchema);

module.exports = ProjectType;