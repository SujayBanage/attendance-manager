const { Student, Instructor } = require("../models/User.js");

const jwt = require("jsonwebtoken");

exports.private = async (req, res, next) => {
  console.log("private middleware is running!!!");
  // console.log(req.body);

  let token;

  if (req.headers.authorization &&req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log(token);

  if (!token) {
    res.json({
      success: false,
      message: "not authorized to access this page",
    });
  }
  else
  {
      try
      {

        console.log("try block is running!!");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
    
        const student = await Student.findOne({ _id: decoded.id }).select('-password');
    
        const instructor = await Instructor.findOne({ _id: decoded.id }).select('-password');
    
        if (student) {
          req.student = student;
        }
        if (instructor) {
          req.instructor = instructor;
          // console.log(req.instructor);
        }
    
        // if(!student || !instructor){
        //     res.status(404).json({
        //         success:false,
        //         message:"no user found with this id",
        //     })
        // }
    
        next();
      }
      catch(e)
      {
        res.json({
          message: `some error occured ${e.message}`,
          success: false,
        });
      }
  }

};
