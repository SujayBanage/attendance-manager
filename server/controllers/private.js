const Cource = require("../models/Course.js");
const {Instructor , Student} = require("../models/User.js");

const crypto = require("crypto");

exports.getStudentData = (req, res) => {
  try {
    console.log("getStudentData is called");
    console.log(req.student);
    res.status(200).send(req.student);
  } catch (err) {
    console.log("not found student", err.message);
  }
};

exports.getInstructorData = (req, res) => {
  try {
    
    console.log("getInstructorData is called");
    console.log(req.instructor);
    req.instructor ? res.status(200).send(req.instructor) : res.json({
      success:false,
      message:"you are not allowed to visit instructor dashboard!!"
    });

  } catch (err) {
    console.log("not found instructor", err.message);
  }
};

exports.addCourceData = async (req, res) => {
  console.log("addCourceData is called");
  console.log(req.instructor.name + "is adding this cource");

  const { courceName, totalLectures, currentLectures } = req.body;

  if (!courceName || !totalLectures || !currentLectures) {
    res.json({
      success: false,
      message: "All fields are required!!",
    });
  }
  else{

    try {
  
      const unique = await Cource.findOne({ courceName: courceName });
  
      if (unique) {
        res.json({
          success: false,
          message: "This cource already exists!!",
        });
      }
      else{

        const courceCreator = {
          id:req.instructor._id,
          name:req.instructor.name,
          email:req.instructor.email,
        }
    
        const courceKey = crypto.randomBytes(10).toString("hex");
        
        const cource = await Cource.create({
            courceName:courceName,
            totalLectures:totalLectures,
            currentLectures:currentLectures,
            courceCreator:courceCreator,
            courceKey:courceKey,
        })
    
        const updates = {
          id:cource._id,
          courcename:cource.courceName
        }
    
        const instructor = await Instructor.findByIdAndUpdate({_id:req.instructor._id},{$push:{coursesAdded:updates}});
        console.log(instructor);
    
        res.json({
          success:true,
          message:"Cource added successfully"
        })
      }
    }
    catch (err) {
      console.log("add cource error", err.message);
      res.status(500).json({
        success:false,
        message:"Cource creation failed!!"
      })
    }
  }
};



exports.getCourceData = async(req,res)=>{

  const id = req.params.id;
  
  console.log(id);

  if(req.student){

    console.log(req.student);

    try{
  
      const cource = await Cource.findOne({_id:id}).select('-courceKey');
      
      console.log(cource);
  
      if(!cource){
        res.status(404).json({
          success:false,
          message:"Cource not found!"
        })
      }
      else{
        // res.status(200).send(cource);
        res.status(200).json({success:true,data:cource})
      }
  
    }
    catch(err){
  
      res.json({
        success:false,
        message:`cource not found! ${err.message}`
      })

    }
  }
  else{

    console.log(req.instructor)

    try{
  
      const cource = await Cource.findOne({_id:id});
      
      console.log(cource);
  
      if(!cource){
        res.status(401).json({
          success:false,
          message:"Cource not found!"
        })
      }
      else{
        // res.status(200).send(cource);
        res.status(200).json({success:true,data:cource,message:"cources found!!"})
      }
  
    }
    catch(err){
  
      res.status(500).json({
        success:false,
        message:`cource not found! ${err.message}`
      })
  
    }


  }



}

exports.deleteCourceData =async(req,res)=>{
  const _id = req.params.id;

  console.log("delete cource data is running!!!");


  if(req.student){
    
    const cource1 = await Cource.findById(_id);
    console.log(cource1);

    if(!cource1){

      const updateduser = req.student.deleteCource(_id);  
      console.log(updateduser);
  
      res.json({
        success: true,
        message:"cource unenroll successfull!!"  
      })

      // res.json({success:false,message:"cource not found"});
    }
    else{

      const cource__2 = await Cource.updateOne({_id:cource1._id},{$pull:{'courceUsers':{'email':req.student.email}}});
      console.log("this is cource 2 ",cource__2);

      // const updatedCource = cource1.deleteCourceUser(req.student._id);
      // console.log(updatedCource);




      const updateduser = req.student.deleteCource(_id);  
      console.log(updateduser);
  
      res.json({
        success: true,
        message:"cource unenroll successfull!!"  
      })
    }

  }else{
    try{
      const cource1 = await Cource.findByIdAndDelete(_id);
      console.log(cource1);

      const instructor = req.instructor.deleteCource(_id);
  
      console.log(instructor);
  
      if(!cource1){
        res.status(404).json({
          success: false,
          message:"cource not found!!",
        })
      }
      else{
  
        res.json({
          success: true,
          message:"cource deleted!!!"
        })
  
      }
  
    }
    catch(err){
  
      res.json({
        success:false,
        message:`cource delete failed!! ${err.message}`
      })
  
    }
  }



}

exports.joinCource = async(req,res)=>{
  
  console.log(req.body);
  console.log("join cource is running");

  console.log(req.student,"is adding this cource!!");

  const courcekey = req.body.courcekey;

  if(!courcekey){
    res.json({
      success:false,
      message:"pls enter again!!!"
    })
  }
  else{
    try{
      const cource = await Cource.findOne({courceKey:courcekey});
      console.log(cource);
      const response = cource.CheckDuplicateCourceUser(req.student._id);

      console.log(response);

      if(response.success===true){
        const response = req.student.duplicateCource(cource._id);
        if(response.success===false){
          res.json({
            success:response.success,
            message:response.message
          })
        }else{
          const courceUser = {
            id:req.student._id,
            email:req.student.email,
            rollno:req.student.rollno,
            attendance:0,
          }
          
          const updatedCource = await Cource.findByIdAndUpdate({_id:cource._id},{$push:{courceUsers:courceUser}});
    
          console.log(updatedCource);
    
          const courceAdd = {
            id:cource._id,
            coursename:cource.courceName,
          }
    
          const student = await Student.findOneAndUpdate({_id:req.student._id},{$push:{courses:courceAdd}});
    
          console.log(student);
          console.log(student.courses);
          
          res.json({
            success:true,
            message:"cource added successfully!!"
          })
        }  
      }
      else{
        res.json({
          success:false,
          message:response.message
        })
      }
    }
    catch (err) {

      res.json({
        success:false,
        message:"cource add failed"
      })

    }

  }

}




exports.addAttendance = async(req,res)=>{

  console.log("add attendance is running");

  const id = req.params.id;
  const useremail = req.params.useremail;

  try{
    const cource = await Cource.findOne({_id:id});
    console.log(cource);
    if(!cource){
      res.status(404).json({
        success:false,
        message:"cource not found!!!"
      })
    }
    else{

      const updatedCource = cource.addattendance(useremail);
      console.log(updatedCource);

      res.status(200).json({
        succes:true,
        message:"added attendance"
      })

    }

  }
  catch(err){

    res.status(500).json({
      success:false,
      message:"attendance failed!!"
    })


  }

}

exports.increaseCurrentLectures = async(req,res)=>{
  const id = req.params.id;
  try{

    const cource = await Cource.findOne({_id:id});

    if(!cource){
      res.status(404).json({
        success:false,
        message:"cource not found!!",
      })
    }

    const response = cource.updateCurrentLectures();

    if(response.success===true){
      res.status(200).json({
        success:true,
        message:"cource updated!!"
      })
    }else{
      res.status(400).json({
        success:false,
        message:response.message,
      })
    }
  }
  catch(err){


  }



}