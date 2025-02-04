const express = require('express')
const routes = express.Router()
const UserCtrl = require('../../controller/usercontroller')
const upload = require('../../middleware/filemidleware')

routes.post('/perseonalDetails',upload.single('file'),UserCtrl.perseonalDetails)
routes.post('/deviceList-Post',UserCtrl.deviceList)
routes.get('/deviceList',UserCtrl.getdeviceList)
routes.post('/ProjectTypeList-Post',UserCtrl.ProjectTypeList)
routes.get('/ProjectTypeList',UserCtrl.getProjectTypeList)
routes.get('/projectName',UserCtrl.getProjectName)
routes.get('/project/:id',UserCtrl.getProjectTypeById)
routes.post('/report',upload.single('file'),UserCtrl.postReport)

module.exports = routes 