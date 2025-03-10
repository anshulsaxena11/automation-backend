const express = require('express')
const routes = express.Router()
const UserCtrl = require('../../controller/usercontroller')
const upload   = require('../../middleware/filemidleware')

routes.post('/perseonalDetails',upload.single('file'),UserCtrl.perseonalDetails)
routes.post('/deviceList-Post',UserCtrl.deviceList)
routes.post('/directrate',UserCtrl.directrate)
routes.post('/ProjectTypeList-Post',UserCtrl.ProjectTypeList)
routes.post('/report',upload.any(),UserCtrl.postReport)
routes.get('/deviceList',UserCtrl.getdeviceList)
routes.get('/ProjectTypeList',UserCtrl.getProjectTypeList)
routes.get('/projectName',UserCtrl.getProjectName)
routes.get('/project/:id',UserCtrl.getProjectTypeById)
routes.get('/directrate' ,UserCtrl.getDirectrateList)
routes.get('/projectDetails',UserCtrl.getProjecDetails)
routes.get('/projectDetails/:id',UserCtrl.getProjecDetailsById)
routes.put('/projectDetails/:id',upload.single('workOrder'),UserCtrl.editProjectDetails)
routes.get('/report',UserCtrl.getReportDetails);
routes.get('/vulnerability',UserCtrl.getVulnerability);
routes.get('/report/:id',UserCtrl.getReportDetailsById)
routes.put('/report/:id',upload.any(),UserCtrl.updateReportById)

module.exports = routes 