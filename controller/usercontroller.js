const projectdetailsModel = require('../models/projectDetailsModel')
const deviceListModel = require('../models/deviceslistModel')
const projectTypeModel = require('../models/projectTypeModel')
const reportModel = require('../models/reportModel')

const mongoose = require("mongoose");


const perseonalDetails = async (req, res) => {
    try {
        const projectDetail = req.body;
        if(!projectDetail){
            res.status(400).json({
                statusCode:400,
                message :"please enter the require field",
            })
        }
        const file = req.file;    
        if (projectDetail.projectType) {
            if (typeof projectDetail.projectType === "string") {

                projectDetail.projectType = projectDetail.projectType.split(',');
            }
            if (!Array.isArray(projectDetail.projectType)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "projectType should be an array of ObjectIds.",
                });
            }
                projectDetail.projectType = projectDetail.projectType
                    .filter(id => mongoose.Types.ObjectId.isValid(id) && id.trim() !== "") 
                    .map(id => new mongoose.Types.ObjectId(id)); 
        } else {
            projectDetail.projectType = [];
        }
    
        if (file) {
            projectDetail.workOrder = `/uploads/agreement/${file.filename}`;
        }

        const newPersonalDetails = new projectdetailsModel(projectDetail);
        await newPersonalDetails.save();

        res.status(200).json({
            statusCode: 200,
            message: "Project Created Successfully",
            personalDetails: newPersonalDetails,
        });

    } catch (error) {
        console.error("Error saving project:", error);
        res.status(400).json({
            statusCode: 400,
            message: "Unable to save Data",
            data: error.message || error,
        });
    }
};

const deviceList = async (req,res) => {
    try{
        const devicelist = req.body;
        const existdevicelist = await deviceListModel.findOne({ devicesName:devicelist.devicesName  });
        if (existdevicelist){
            res.status(400).json({
                statusCode:400,
                message:"Name Of Device already exist "
            })
        } else{
            const newdevicelist = await deviceListModel(devicelist);
            await newdevicelist.save();
            res.status(200).json({
                statusCode:200,
                message:"Device has benn Updated",
                data:newdevicelist
            })
        }
    } catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to Update Devices",
            data: error.message || error
        })
    }
}

const getdeviceList = async(req,res) =>{
    try{
        const deviceList = await deviceListModel.find().select('_id devicesName');;
        res.status(200).json({
            statusCode: 200,
            message:"",
            data:deviceList
        })

    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to get device list",
            data:error.message || error
        })
    }
}

const ProjectTypeList = async (req,res) => {
    try{
        const projectType = req.body;
        const existProjectTypeList = await deviceListModel.findOne({ ProjectTypeName:projectType.ProjectTypeName  });
        if (existProjectTypeList){
            res.status(400).json({
                statusCode:400,
                message:"Name Of Device already exist "
            })
        } else{
            const newProjectTypeList = await projectTypeModel(projectType);
            await newProjectTypeList.save();
            res.status(200).json({
                statusCode:200,
                message:"Device has benn Updated",
                data:newProjectTypeList
            })
        }
    } catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to Update Devices",
            data: error.message || error
        })
    }
}

const getProjectTypeList = async(req,res) =>{
    try{
        const projecttypeList = await projectTypeModel.find().select('_id ProjectTypeName');;
        res.status(200).json({
            statusCode: 200,
            message:"",
            data:projecttypeList
        })

    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to get device list",
            data: error.message || error
        })
    }
}
const getProjectName = async(req,res) =>{
    try{
        const projectName = await projectdetailsModel.find().select('_id projectName');
        res.status(200).json({
            statusCode:200,
            message : "list has been fetched",
            data : projectName
        })
    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to get device list",
            data: error.message || error
        })
    }
}

const getProjectTypeById = async(req,res) =>{
    const {id} = req.params;
    try{
        const ProjectDetails = await projectdetailsModel.findById(id);
        
        if (!Array.isArray(ProjectDetails.projectType)) {
            return res.status(400).json({
              statusCode: 400,
              message: "projectType should be an array",
              data: null,
            });
          }
          const projectTypeList = await projectTypeModel.find({
            _id: { $in: ProjectDetails.projectType },
          });
        if (projectTypeList.length === 0) {
            return res.status(404).json({
            statusCode: 404,
            message: "No matching project types found",
            data: [],
            });
        }

        const projectTypeNames = projectTypeList.map((type) => type.ProjectTypeName);

        res.status(200).json({
            statusCode:200,
            message:"ProjectTYpe has been fetched",
            data:projectTypeNames
        })

    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:"Unable to get projct Details",
            data: error.message || error,
        })
    }
}

const postReport = async (req, res) => {
    try {
        const { proofOfConcept, ...ReportDetails } = req.body; 
        let parsedProofOfConcept = [];

               if (proofOfConcept) {
            try {
                
                parsedProofOfConcept = typeof proofOfConcept === 'string' 
                    ? JSON.parse(proofOfConcept) 
                    : proofOfConcept;
            } catch (error) {
                throw new Error("Invalid proofOfConcept format");
            }
        }

  
        if (Array.isArray(parsedProofOfConcept)) {
            parsedProofOfConcept = parsedProofOfConcept.map((step, index) => ({
                noOfSteps: step.noOfSteps,
                description: step.description,
                proof: req.files?.[index] ? req.files[index].path : "", // Save file path if uploaded
            }));
        } else {
            throw new Error("proofOfConcept must be an array of steps");
        }

  
        const newReport = new reportModel({
            ...ReportDetails,
            proofOfConcept: parsedProofOfConcept,
        });


        await newReport.save();

        return res.status(201).json({
            statusCode: 201,
            message: "Report created successfully",
            data: newReport,
        });

    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            message: "Unable to save report details",
            error: error.message || error,
        });
    }
};

module.exports = {
    perseonalDetails,
    deviceList,
    getdeviceList,
    ProjectTypeList,
    getProjectTypeList,
    getProjectName,
    getProjectTypeById,
    postReport
}
