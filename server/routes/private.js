const express = require('express');

const PrivateRouter = express.Router();

const {getStudentData,getInstructorData,addCourceData,getCourceData,deleteCourceData,joinCource,addAttendance,increaseCurrentLectures} = require('../controllers/private.js');
const {private}  = require('../middleware/privatemiddleware.js');

PrivateRouter.get('/getStudentData',private,getStudentData);
PrivateRouter.get('/getInstructorData',private,getInstructorData);
PrivateRouter.post('/addCource',private,addCourceData);
PrivateRouter.get('/getCourceData/:id',private,getCourceData);
PrivateRouter.delete('/deleteCource/:id',private,deleteCourceData);
PrivateRouter.post('/joinCource',private,joinCource);
PrivateRouter.patch('/addAttendance/:id/:useremail',addAttendance);
PrivateRouter.patch('/currentLectures/:id',increaseCurrentLectures);

module.exports = PrivateRouter;