const projectdetailsModel = require('../models/projectDetailsModel')
const deviceListModel = require('../models/deviceslistModel')
const projectTypeModel = require('../models/projectTypeModel')
const reportModel = require('../models/reportModel')
const directrateModel = require('../models/directrateModel')
const vulnerabilityModel = require('../models/vulnerabilityTypesModel')
const webVulnarabilityModel = require('../models/webVulnabilityModel')
const apiVulnabilityModel = require('../models/apiVulnabilityModel')
const MobileApplicationModel = require('../models/mobileApplicationModel')
const SourceCodeModel = require('../models/sourceCodeModel')
const DesktopModel = require('../models/desktopVulnabelityModel')
const SwitchLThreeModel = require('../models/switchLThreeModel')
const SwitchLTwoModel = require('../models/switchLTwo')
const AttendanceSystemModel = require('../models/AttendanceSystemModel')
const CameraModel = require('../models/camera')
const WifiModel = require('../models/WiFiModel')
const ServerHardwareModel = require("../models/serverHardwareModel")
const VcEquipmentModel = require("../models/vcEquipmentModel")
const RouterModel = require('../models/routerVulmerabilityModel')
const RoundModel = require('../models/roundModel')
const stpiEmpDetailsModel = require('../models/StpiEmp')

const mongoose = require("mongoose");

//Project Details API
const perseonalDetails = async (req, res) => {
    try {
        const projectDetail = req.body;
        if(!projectDetail){
            res.status(400).json({
                statusCode:400,
                message :"please enter the require field",
            })
        }
        const existingWorkOrder = await projectdetailsModel.findOne({ workOrderNo: projectDetail.workOrderNo });
        if (existingWorkOrder) {
            return res.status(400).json({
                statusCode: 400,
                message: "Work Order Number already exists. It must be unique.",
            });
        }
        const existingProjectName = await projectdetailsModel.findOne({ projectName: projectDetail.projectName });
        if (existingProjectName) {
            return res.status(400).json({
                statusCode: 400,
                message: "Project Name already exists. It must be unique.",
            });
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
            const fileExtension = file.mimetype.split('/')[1];
            if (!['jpeg', 'png', 'pdf'].includes(fileExtension)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid file type. Only image or PDF files are allowed.",
                });
            }

            let fileFolder = 'uploads/other'; 
            if (file.mimetype.startsWith('image/')) {
                fileFolder = 'uploads/image';
            } else if (file.mimetype === 'application/pdf') {
                fileFolder = 'uploads/agreement'; 
            }

            projectDetail.workOrder = `/${fileFolder}/${file.filename}`;
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
// saving device data In dropdown
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
//getting device list for dropdown
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
// saving list of scopeOfWork
const ProjectTypeList = async (req,res) => {
    try{
        const projectType = req.body;
        const existProjectTypeList = await projectTypeModel.findOne({ ProjectTypeName:projectType.ProjectTypeName  });
        if (existProjectTypeList){
            res.status(400).json({
                statusCode:400,
                message:"Scope of work already exist"
            })
        } else{
            const newProjectTypeList = await projectTypeModel(projectType);
            await newProjectTypeList.save();
            res.status(200).json({
                statusCode:200,
                message:"Scope of work has been Updated",
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
//gettng list for ScopeofWork
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
//use to get scope ofwork in dropdown
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
// getting projrct List API
const getProjecDetails = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const query = search
        ? {
            $or: [
              { workOrderNo: { $regex: search, $options: "i" } },
              { projectName: { $regex: search, $options: "i" } },  // Example for searching by projectName
            ]
          }
        : {};
      const totalCount = await projectdetailsModel.countDocuments(query);
      const projects = await projectdetailsModel.find(query)
        .populate({
          path: "projectType",
          model: "ProjectType",
          select: "ProjectTypeName", 
        })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      res.status(200).json({
        statuscode: 200,
        success: true,
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
        data: projects,
      });
    } catch (error) {
      res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Server Error",
        error,
      });
    }
  };

//get project details by Id

  const getProjecDetailsById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await projectdetailsModel.findById(id).populate({
            path: "projectType",
            model: "ProjectType",
            select: "ProjectTypeName",
        });


        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Project not found",
            });
        }

        // Construct full URL for workOrder (PDF file)
        const workOrderUrl = project.workOrder
            ? `${req.protocol}://${req.get('host')}${project.workOrder}`
            : null;

        res.status(200).json({
            statusCode: 200,
            success: true,
            data: {
                ...project._doc,
                workOrderUrl, 
            },
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Server Error",
            error: error.message || error,
        });
    }
};

// edit perseonal Details

const editProjectDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const file = req.filePath;


        const project = await projectdetailsModel.findById(id)
        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                message: "Project not found",
            });
        }


        if (updateData.workOrderNo) {
            const existingProject = await projectdetailsModel.findOne({
                workOrderNo: updateData.workOrderNo,
                _id: { $ne: id }, // Exclude current project
            });

            if (existingProject) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "workOrderNo must be unique. A project with this workOrderNo already exists.",
                });
            }
        }

        // Validate and fetch project type names
        let projectTypeNames = [];
        if (updateData.projectType) {
            if (typeof updateData.projectType === "string") {
                updateData.projectType = updateData.projectType.split(",");
            }
            if (!Array.isArray(updateData.projectType)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "projectType should be an array of ObjectIds.",
                });
            }

            updateData.projectType = updateData.projectType
                .filter((id) => mongoose.Types.ObjectId.isValid(id) && id.trim() !== "")
                .map((id) => new mongoose.Types.ObjectId(id));

            const validProjectTypes = await projectTypeModel.find(
                { _id: { $in: updateData.projectType } },
                { _id: 1, projectTypeName: 1 } // Only fetching names
            );

            if (validProjectTypes.length !== updateData.projectType.length) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid projectType IDs provided.",
                });
            }

            projectTypeNames = validProjectTypes.map((type) => type.projectTypeName);
        }
        if (file) {
            updateData.workOrder = file;
        } else {
            updateData.workOrder = project.workOrder; 
        }
        const updatedProject = await projectdetailsModel.findByIdAndUpdate(id, updateData, {
            new: true,
        }).populate({
            path: "projectType",
            model: "ProjectType",
            select: "ProjectTypeName",
        });;

        const workOrderUrl = updatedProject.workOrder
        ? `${req.protocol}://${req.get("host")}${updatedProject.workOrder}`
        : null;

        res.status(200).json({
            statusCode: 200,
            message: "Project Updated Successfully",
            projectDetails: updatedProject,
            projectTypeNames, 
            filePreviewUrl: workOrderUrl,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            error: error.message || error,
        });
    }
};

//fetch project type by Id in Report
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
//save report
const postReport = async (req, res) => {
    try {
        const { proofOfConcept, ...ReportDetails } = req.body;
        let parsedProofOfConcept = [];

        // Parse proofOfConcept JSON if it exists
        if (proofOfConcept) {
            try {
                parsedProofOfConcept = typeof proofOfConcept === "string" 
                    ? JSON.parse(proofOfConcept) 
                    : proofOfConcept;
            } catch (error) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid proofOfConcept format",
                    error: "proofOfConcept must be a valid JSON array",
                });
            }
        }

        // Ensure parsedProofOfConcept is an array
        if (!Array.isArray(parsedProofOfConcept)) {
            return res.status(400).json({
                statusCode: 400,
                message: "proofOfConcept must be an array of steps",
            });
        }

        let proofFiles = {};
        if (req.files) {
            req.files.forEach((file) => {
                const match = file.fieldname.match(/\[(\d+)\]/); // Extract index from proof[0], proof[1]
                if (match) {
                    const index = match[1]; // Get index from match
                    proofFiles[index] = `/uploads/image/${file.filename}`;
                }
            });
        }

        parsedProofOfConcept = parsedProofOfConcept.map((step, index) => ({
            noOfSteps: step.noOfSteps,
            description: step.description,
            proof: proofFiles[index] || "", // Get file path if exists
        }));


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
        console.error("Error saving report:", error); // Debugging log

        return res.status(500).json({
            statusCode: 500,
            message: "Unable to save report details",
            error: error.message || error,
        });
    }
};

// save directorates
const directrate = async (req,res) => {
    try{
        const directrate = req.body;
        const existdirectrate = await directrateModel.findOne({ directrate:directrate.directrate  });
        if (existdirectrate){
            res.status(400).json({
                statusCode:400,
                message:"Directorates already exist "
            })
        } else{
            const newDirectrate = await directrateModel(directrate);
            await newDirectrate.save();
            res.status(200).json({
                statusCode:200,
                message:"Directorates has benn Updated",
                data:newDirectrate
            })
        }
    } catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to Update Directorates",
            data: error.message || error
        })
    }
}
// get Directorate List
const getDirectrateList = async(req,res) =>{
    try{
        const directrateList = await directrateModel.find().select('_id directrate');;
        res.status(200).json({
            statusCode: 200,
            message:"",
            data:directrateList
        })

    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to get directrate list",
            data: error.message || error
        })
    }
}

// get Report List

const getReportDetails = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const query = search
        ? {
            $or: [
              { workOrderNo: { $regex: search, $options: "i" } },
              { projectName: { $regex: search, $options: "i" } },  // Example for searching by projectName
            ]
          }
        : {};
      const totalCount = await reportModel.countDocuments(query);
      const report = await reportModel.find(query)
        .populate({
          path: "projectName",
          model: "ProjectDetails",
          select: "projectName -_id", 
        })
        .lean()
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

        report.forEach(item => {
            if (item.projectName && item.projectName.projectName) {
              item.projectName = item.projectName.projectName; // Set projectName to the value
            }
          });

      res.status(200).json({
        statuscode: 200,
        success: true,
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
        data: report,
      });
    } catch (error) {
      res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Server Error",
        error,
      });
    }
  };
 // get details of vulnerability
 const getVulnerabilityDetails = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "", ProjectType } = req.query; // Extract from query params
  
      let query = {};
  

      if (search) {
        query.$or = [{ vulnerabilityModel: { $regex: search, $options: "i" } }];
      }
  
      if (ProjectType) {
        query.criteria = ProjectType;
      }

      const totalCount = await vulnerabilityModel.countDocuments(query);
  
      const report = await vulnerabilityModel
        .find(query)
        .lean()
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        statuscode: 200,
        success: true,
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
        data: report,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };
  //webVulnability
  const getVulnerability = async (req, res) => {
    const { page = 1, limit = 10, search = "", ProjectType } = req.query;
    let query = {};

    if (search) {
        query.$or = [{ vulnerabilityModel: { $regex: search, $options: "i" } }];
    }

    try {
        let Model;

        if (ProjectType === "Website") {
            Model = webVulnarabilityModel; 
        } else if (ProjectType === "API") {
            Model = apiVulnabilityModel; 
        } else if (ProjectType === "Mobile Application"){
            Model = MobileApplicationModel; 
        } else if (ProjectType ==="Source Code"){
            Model = SourceCodeModel; 
        } else if(ProjectType === "Desktop"){
            Model = DesktopModel;
        } else if(ProjectType === "Switch-L3"){
            Model = SwitchLThreeModel
        }else if (ProjectType === "Switch-L2"){
            Model = SwitchLTwoModel
        }else if (ProjectType === "Attendance System"){
            Model = AttendanceSystemModel
        }else if (ProjectType === "Camera"){
            Model = CameraModel
        }else if (ProjectType === "Wi-Fi"){
            Model = WifiModel
        } else if(ProjectType === "Server Hardware"){
            Model = ServerHardwareModel
        }else if(ProjectType === "VC Equipment"){
            Model = VcEquipmentModel
        } else if (ProjectType === "Router"){
            Model=RouterModel
        }else {
            return res.status(400).json({ message: "Invalid ProjectType" });
        }
        const totalCount = await Model.countDocuments(query);
        const vulnerabilities = await Model .find(query)
        .lean()
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

        res.status(200).json({
            statuscode: 200,
            success: true,
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalCount / limit),
            data: vulnerabilities,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
  
  //get ReportDetailsById
const getReportDetailsById = async (req,res) =>{
    try{
        const { id } = req.params
        const report = await reportModel.findById(id)
        .populate({
        path: "projectName",
        model: "ProjectDetails",
        select: "projectName -_id", 
        })
        .lean()
        report.projectName = report.projectName?.projectName || "";

        if (Array.isArray(report.proofOfConcept)) {
            report.proofOfConcept = report.proofOfConcept
                .filter((item) => item.description?.trim() || item.proof?.trim())
                .map((item) => ({
                    ...item,
                    proof: item.proof ? `${req.protocol}://${req.get('host')}${item.proof}` : "",
                }));
        }
        
        res.status(200).json({
        statuscode: 200,
        success: true,
        data:report,
        })
    }catch(error){
        res.status(400).json({
            statuscode: 400,
            success: false,
            messagae:'Server Error',
            data:error,
        })
    }
}

const updateReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const { vulnerabilityName, proofOfConcept, ...updatedDetails } = req.body;
        const files = req.files || [];

        if (Array.isArray(vulnerabilityName)) {
            updatedDetails.vulnerabilityName = [...new Set(vulnerabilityName)].join(", ");
        } else {
            updatedDetails.vulnerabilityName = vulnerabilityName?.trim();
        }

        // Find the report
        const report = await reportModel.findById(id);
        if (!report) {
            return res.status(404).json({ statusCode: 404, message: "Report not found" });
        }

        let parsedProofOfConcept = Array.isArray(report.proofOfConcept) ? [...report.proofOfConcept] : [];

        if (proofOfConcept) {
            try {
                parsedProofOfConcept = typeof proofOfConcept === "string" ? JSON.parse(proofOfConcept) : proofOfConcept;
            } catch (error) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid proofOfConcept format",
                    error: error.message,
                });
            }
        }

        if (!Array.isArray(parsedProofOfConcept)) {
            return res.status(400).json({
                statusCode: 400,
                message: "proofOfConcept must be an array of steps",
            });
        }

        if (files.length > parsedProofOfConcept.length) {
            return res.status(400).json({
                statusCode: 400,
                message: "Too many proof files uploaded. Each proofOfConcept step should have one file.",
            });
        }

        const normalizePath = (filePath) => filePath.replace(/\\/g, "/").replace(/^.*uploads\//, "/uploads/");

        // Organize files based on fieldname (proofOfConcept[0][proof], proofOfConcept[1][proof], etc.)
        const fileMap = {};
        files.forEach((file) => {
            const match = file.fieldname.match(/\[(\d+)]\[\w+]/); // Extract index from fieldname
            if (match) {
                const index = parseInt(match[1], 10);
                fileMap[index] = normalizePath(file.path); // Map file to index
            }
        });

        // Update proofOfConcept array with corresponding files
        parsedProofOfConcept = parsedProofOfConcept.map((step, index) => ({
            noOfSteps: step.noOfSteps?.trim() || `Step ${index + 1}`,
            description: step.description?.trim() || "",
            proof: fileMap[index] || step.proof, // Replace only if a new file exists
        }));

        // Save relative path for proofDocument (if uploaded)
        if (files.length > 0) {
            updatedDetails.proofDocument = normalizePath(files[0].path);
        }

        const updatedReport = await reportModel.findByIdAndUpdate(
            id,
            { ...updatedDetails, proofOfConcept: parsedProofOfConcept },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedReport) {
            return res.status(404).json({ statusCode: 404, message: "Report not found after update" });
        }

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        updatedReport.proofDocument = updatedReport.proofDocument ? `${baseUrl}/${updatedReport.proofDocument}` : null;
        updatedReport.proofOfConcept = updatedReport.proofOfConcept.map((step) => ({
            ...step,
            proof: step.proof ? `${step.proof}` : null,
            proofPreviwe: step.proof ? `${baseUrl}${step.proof}` : null,
        }));

        res.status(200).json({
            statusCode: 200,
            message: "Report updated successfully",
            reportDetails: updatedReport,
        });

    } catch (error) {
        console.error("Error updating report:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Unable to update report details",
            error: error.message || error,
        });
    }
};

const getRound = async (req, res) => {
    try {
        const { projectName, projectType } = req.query; // Extract query parameters

        if (!projectName || !projectType) {
            return res.status(400).json({
                statusCode: 400,
                message: "Missing projectName or projectType",
            });
        }

        const rounds = await reportModel
            .find({ projectName, projectType })
            .select("round");

        // Convert rounds to numbers, remove duplicates, and sort in ascending order
        const roundList = [...new Set(rounds.map(item => Number(item.round)))]
            .filter(num => !isNaN(num)) // Ensure only valid numbers
            .sort((a, b) => a - b);

        return res.status(200).json({
            statusCode: 200,
            message: "Rounds retrieved successfully",
            data: roundList,
        });

    } catch (error) {
        console.error("Error retrieving rounds:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Unable to retrieve round details",
            error: error.message || error,
        });
    }
};

const getFullReport = async (req, res) => {
    try {
        const { projectName, projectType, round } = req.query;

        // Fetch full report
        const fullReport = await reportModel.find({ projectName, projectType, round });

        // Fetch project details
        const projectDetails = await projectdetailsModel.find({ _id: projectName });

        // Ensure fullReport exists and has proofOfConcept
        const updatedReports = fullReport.map((report) => {
            if (Array.isArray(report.proofOfConcept)) {
                report.proofOfConcept = report.proofOfConcept
                    .filter((item) => item.description?.trim() || item.proof?.trim())
                    .map((item) => ({
                        ...item,
                        proof: item.proof ? `${req.protocol}://${req.get('host')}${item.proof}` : "",
                    }));
            }
            return report;
        });

        res.status(200).json({
            statusCode: 200,
            message: "Rounds retrieved successfully",
            data: projectDetails , 
            response: updatedReports , 
        });

    } catch (error) {
        console.error("Error fetching report:", error);
        res.status(400).json({
            statusCode: 400,
            message: "Unable to get full report details",
            error: error.message || error,
        });
    }
};

const getAllRound = async (req,res) => {
    try{
        const rounds = await RoundModel.find().sort({value: 1});
        res.status(200).json({
            statuscode:200,
            data:rounds
        })
    } catch(error){
        console.error("Error fetching round:", error);
        res.status(400).json({
            statusCode: 400,
            message: "Unable to get rounds",
            error: error.message || error,
        });
    }
}

const addNewRound = async (req,res) => {
    try{
        const existingRound = await RoundModel.find({}, 'value') 
        const usedValues = existingRound.map(round => Number(round.value));
        let  newValue = 1;
        while (usedValues.includes(newValue)) {
            newValue++;
          }

        const newRound = await RoundModel.create({
            label: `Round ${newValue}`,
            value: newValue
        })

        res.status(200).json({
            statuscode:200,
            message:'new Round Added',
            data:newRound
        })
        
    }catch(err){
        res.status(400).json({
            statuscode:400,
            message: 'Failed to add round', 
            error: err
        })
    }
}

const getStpiEmpListActive = async (req, res) => {
    try {
      const { page = 1, limit = 10, search=" ",centre=" " ,etpe=" ", projectId = "", dir=" "} = req.query;
      let mappedEmployeeIds = [];
      if (projectId.trim()) {
        const project = await projectdetailsModel.findById(projectId).select('resourseMapping');
        if (project) {
          mappedEmployeeIds = project.resourseMapping.map(id => id.toString());
        }
      }
      const query = {
        StatusNoida: true,
        ...(search.trim()
          ? {
              $or: [
                { centre: { $regex: search, $options: "i" } },
                { etpe: { $regex: search, $options: "i" } },
                { ename: { $regex: search, $options: "i" } },
                { empid: { $regex: search, $options: "i" } },
                { dir: { $regex: search, $options: "i" } },
              ],
            }
          : {}),
          ...(centre.trim() ? { centre: centre } : {}), 
          ...(dir.trim() ? { dir: dir } : {}),   
          ...(etpe.trim() ? { etpe: etpe } : {}),  
      };
  
      const totalCount = await stpiEmpDetailsModel.countDocuments(query);
      const allData = await stpiEmpDetailsModel.find(query)
      .sort({ createdAt: -1 }) // initial sort
      .lean(); 

  
    const finalData = allData
      .map(emp => ({
        ...emp,
        isChecked: mappedEmployeeIds.includes(emp._id.toString()),
      }))
      .sort((a, b) => (b.isChecked === true) - (a.isChecked === true)) // true on top
      .slice((page - 1) * limit, page * limit); 
    
      const finalCheckedData = allData
        .map(emp => ({
            ...emp,
            isChecked: mappedEmployeeIds.includes(emp._id.toString()),
        }))
        .filter(emp => emp.isChecked) // only checked ones
        .slice((page - 1) * limit, page * limit);
  
      res.status(200).json({
        statusCode: 200,
        success: true,
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
        data: finalData,
        response:finalCheckedData
      });
    } catch (error) {
      res.status(400).json({
        statusCode: 400,
        message: error.message || "Something went wrong",
      });
    }
  };

  const projectMapping = async(req,res) => {
    try{
        const payload = req.body;

        const projectId= payload.projectId;
        const employeeId = payload.employeeIds;

        const project = await projectdetailsModel.findById({_id:projectId})

        if (!projectId || !Array.isArray(employeeId)) {
             res.status(400).json({
              statusCode: 400,
              message: "Invalid projectId or employeeId",
            });
        }
        const currentMapping = new Set(project.resourseMapping.map(id => id.toString()));
        const incomingEmpId = new Set(employeeId.map(id => id.toString()));

        employeeId.forEach(id => currentMapping.add(id.toString()));

        project.resourseMapping.forEach(id => {
            if (!incomingEmpId.has(id.toString())) {
              currentMapping.delete(id.toString());
            }
          });

          project.resourseMapping = Array.from(currentMapping).map(id => new mongoose.Types.ObjectId(id));
        await project.save();
        res.status(200).json({
            statusCode:200,
            message: 'Resource mapping updated successfully', 
            data: project.resourseMapping 
        });
    } catch(error){
        res.status(400).json({
            statuscode:400,
            message :error,
        })
    }

  }

module.exports = {
    perseonalDetails,
    deviceList,
    getdeviceList,
    ProjectTypeList,
    getProjectTypeList,
    getProjectName,
    getProjectTypeById,
    postReport,
    directrate,
    getDirectrateList,
    getProjecDetails,
    getProjecDetailsById,
    editProjectDetails,
    getReportDetails,
    getVulnerabilityDetails,
    getReportDetailsById,
    updateReportById,
    getVulnerability,
    getRound,
    getFullReport,
    getAllRound,
    addNewRound,
    getStpiEmpListActive,
    projectMapping
}
