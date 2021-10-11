const mongoose = require('mongoose');


const CourseSchema = new mongoose.Schema({

    courceName:{
        type:String,
        required:true
    },
    totalLectures:{
        type:Number,
        required:true
    },
    currentLectures:{
        type:Number,
        required:true,
        default:0
    },
    courceKey:{
        type:String,
        unique:[true,"invalid course key"]
    },
    courceUsers:[
        {
           id:mongoose.Schema.Types.ObjectId,
            email:{
                type:String,
                // unique:[true,"invalid user email"],
                sparse:true, //! allows the null value in the field until value is updated
                index:true,
            },
            rollno:{
                type:Number,
                // unique:[true,"invalid user rollno"],
                sparse:true,
                index:true,
            },
            attendance:{
                type:Number,
                sparse:true,
                index:true
            }
        }
    ],
    courceCreator:{
            id:mongoose.Schema.Types.ObjectId,
            name:{
                type:String,
            },
            email:{
                type:String,
                // unique:[true,"invalid instructor email"]
             },
    }
    


});

CourseSchema.methods.addattendance = async function(useremail){

    // let updatedUsers = [];

    this.courceUsers.forEach((user) => {
        if(user.email === useremail){
            user.attendance = user.attendance + 1;
        }
    });

    // if(updatedUsers.length === 0){
        // console.log("users length 0 is running")
        // this.courceUsers = this.courceUsers;
        // await this.save();
    // }
 
    // else{
        // this.courceUsers = [...this.courceUsers,...updatedUsers];
    
        console.log(this.courceUsers);
    
        const updatedCource = await this.save();
    
        return updatedCource;
    // }

}

CourseSchema.methods.deleteCourceUser = async function(id){

    console.log("deleteCource running for student with id : ",id);

    // this.courceUsers = this.courceUsers.filter((user)=>{
    //     return user.id !== id;
    // })
    
    // let updatedusers = []

    try{
        // updatedusers = this.courceUsers.filter((user)=>{
            // console.log(user.id);
            // return user.id !== id;
        // })


        await this.courceUsers.pull({id:id});

        console.log(this.courceUsers);
    
        // console.log("this is cource users : ",updatedusers);
    
        // this.courceUsers = updatedusers;
    
        const updatedCource = await this.save();
    
        return updatedCource;
    }
    catch(error){
        console.log(error.message);
    }


}


CourseSchema.methods.CheckDuplicateCourceUser = function(id){

    console.log("CheckDuplicateCourceUser running for student");

    try{
        let ismatch = false;
        this.courceUsers.forEach((user)=>{
            if(user.id === id){
                ismatch = true;
            }
        })

        if(ismatch===true){
            return{
                success: false,
                message: "Duplicate user found!!"
            }
        }else{
            return{
                success: true,
                message: " no Duplicate user found!!"
            }
        }
    }
    catch(err){
        return {
            success: false,
            message:'check duplicated user failed ' + err.message,
        }
    }

}

CourseSchema.methods.updateCurrentLectures = async function(req,res){
    try{
        if(this.currentLectures<this.totalLectures){
            this.currentLectures = this.currentLectures + 1;
            const updated = await this.save();
            console.log(updated);
            return{
                success:true,
                message:'current lectures updated!!'
            }   
        }
        else{
            return {
                success:false,
                message:'your cource is completed now!!'
            }
        }
    }
    catch(err){        
        return{
            success:false,
            message:'current lectures update failed!!'
        }
    }
}

const Cource = new mongoose.model("Course",CourseSchema);




module.exports = Cource;