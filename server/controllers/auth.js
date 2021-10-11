
const { Student , Instructor} = require('../models/User.js');

exports.UserRegister = async(req,res,next) => {

    const role = req.body.role;

    if(role ==='student')
    {
        try{
            const {name,email,division,password,rollno} = req.body
            
            const unique = await Student.findOne({rollno:rollno,email:email});

            if(unique)
            {
                res.json({success: false,message:"rollno or email already exists"});
            }else{
                const student = await Student.create({
                    name,email,division,password,rollno
                });
            
                // console.log(student);
                
                sendAuthToken(student,201,res);
            }

            
        }
        catch(e){
            res.status(500).json({
                sucess:false,
                message:e.message
            })
        }
    }

    else if(role === "instructor")
    {
        try{
            const {name,email,password} = req.body

            const unique = await Instructor.findOne({name: name, email: email});

            if(unique){
                res.json({success:false,message:"user already exists"});
            }
            else{
                const instructor = await Instructor.create({
                    name,email,password
                });
        
                console.log(instructor);
                
                sendAuthToken(instructor,201,res);
            }

        }
        catch(e) {
            res.status(500).json({
                success:false,
                message:"instructor save process failed!!"
            })
        }

    }

}

exports.StudentLogin = async(req,res,next) => {
    
    const {email , password} = req.body

    if(!email || !password)
    {
        res.status(400).json({
            success: false,
            message:"pls enter valid details"
        })
    }

    try{

        const student = await Student.findOne({email: email});
        
        const ismatch = await student.comparePassword(password);

        if(!student || !ismatch)
        {

            console.log(student);
            console.log(ismatch);

            res.json({
                success: false,
                message:"invalid details"
            })
        }
        else{
            sendAuthToken(student,200,res);
        }

        
    }
    catch(err){
        res.json({
            success: false,
            message:err.message
        })
    }
}

exports.InstructorLogin = async(req,res,next) => {
    
    const {email,password} = req.body

    try{

        const instructor = await Instructor.findOne({email: email});
        
        const ismatch = await instructor.comparePassword(password);

        if(!instructor || !ismatch) 
        {
            res.json({success: false,message:"invalid details"})
        }
        else{
            sendAuthToken(instructor,200,res);
        }

    }
    catch(err){
        res.json({
            success: false,
            message:err.message
        })
    }
}



const sendAuthToken = (user,statuscode,res) => {

    const Token = user.generateAuthToken();

    res.status(statuscode).json({
        success:true,
        Token
    });

}