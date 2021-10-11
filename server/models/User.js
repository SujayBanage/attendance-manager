const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const StudentSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    rollno:{
        type:Number,
        required:true,
        unique:[true, 'roll no already exists'],
    },
    email:{
        type:String,
        required:true,
        unique:[true, 'email already exists'],
        validate(val)
        {
            if(!validator.isEmail(val))
            {
                console.log('invalid email')
            }
        }

    },
    password :{
        type:String,
        required:true,
        unique:[true,"pls enter valid password"]
    },
    division:{
        type:String,
        required:true,
    },
    courses:[
        {
            id:mongoose.Schema.Types.ObjectId,
            coursename:{
                type:String,
            },
        }
    ],
    totalattendance:{
        type:Number,
    }

});

const InstructorSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:[true, 'email already exists'],
        validate(val)
        {
            if(!validator.isEmail(val))
            {
                console.log('invalid email')
            }
        }

    },
    password :{
        type:String,
        required:true,
        unique:[true,'pls enter valid password']
    },
    coursesAdded:[
        {
            id:mongoose.Schema.Types.ObjectId,
            courcename:{
                type:String,
            },
        }
    ]

});

StudentSchema.pre("save",async function(req,res,next){

    if(!this.isModified("password"))
    {   
        next();
    }

    try{

        const salt = await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(this.password, salt);

        // await this.password.save();

        next();

    }
    catch(e){
        // res.json({
        //     success: false,
        //     message: e.message,
        // })
        console.log("error occured while hashing password!!!!");
    }

});

InstructorSchema.pre("save",async function(req,res,next){

    if(!this.isModified("password"))
    {   
        next();
    }

    try{

        const salt = await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(this.password, salt);

        // await this.password.save();

        next();

    }
    catch(e){
        // res.json({
        //     success: false,
        //     message: e.message,
        // })
        console.log("error occured while hashing password!!!!");
    }

});

StudentSchema.methods.generateAuthToken = function(req,res,next){

    const payload= {
        id:this._id,
    }
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})

}
InstructorSchema.methods.generateAuthToken = function(req,res,next){

    const payload= {
        id:this._id,
    }
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})

}


StudentSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

StudentSchema.methods.duplicateCource = async function(req,res,next,courceid){
    this.courses.filter((course)=>{

        if(course.id === courceid){

            return {
                success:false,
                message:"Duplicate cource found!!!"
            }

        }

        return course.id !== courceid;
    })
    
    await this.save();

}

StudentSchema.methods.deleteCource = async function(id){

    console.log(id);

    try{
        this.courses = this.courses.filter((course)=>{
            return course.id != id;
        })
    
        const updateduser = await this.save();
    
        return updateduser;
    }
    catch(error){
        console.log(error.message);
    }

}



InstructorSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

InstructorSchema.methods.deleteCource = async function(id){
    this.coursesAdded = this.coursesAdded.filter((cource)=>{
        return cource.id != id;
    });

    console.log(this.coursesAdded);

    const savedInsructor = await this.save();

    return savedInsructor;
}




exports.Student = new mongoose.model('Student',StudentSchema);

exports.Instructor = new mongoose.model('Instructor',InstructorSchema);


