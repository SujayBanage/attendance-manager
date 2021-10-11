const Cource = require("../models/Course.js");
const { Instructor, Student } = require("../models/User.js");

const socketListeners = (io) => {
  io.on("connection", (socket) => {
    console.log("connected!!!");

    // * ON JOIN
    socket.on("join", ({ roomname }) => {
      socket.join(roomname);
      console.log(`joined ${roomname} successfully!!`);
    });

    // * JOIN COURCE

    socket.on("joinCource", async ({ courcekey, studentid }) => {
      try {
        const student = await Student.findById({ _id: studentid });
        const cource = await Cource.findOne({ courceKey: courcekey });
        console.log(cource);
        const response = cource.CheckDuplicateCourceUser(student._id);
        console.log(response);

        if (response.success === true) {
          const response = student.duplicateCource(cource._id);
          if (response.success === false) {
            io.to("studentdashboard").emit("joinCourceFailed", {
              message: "you alreay have this cource!!",
            });
          } else {
            const courceUser = {
              id: student._id,
              email: student.email,
              rollno: student.rollno,
              attendance: 0,
            };
            const updatedCource = await Cource.findByIdAndUpdate(
              { _id: cource._id },
              { $push: { courceUsers: courceUser } }
            );

            const courceAdd = {
              id: cource._id,
              coursename: cource.courceName,
            };

            const updatedStudent = await Student.findOneAndUpdate(
              { _id: student._id },
              { $push: { courses: courceAdd } },
              { new: true }
            );

            io.to("studentdashboard").emit("joinCourceSuccess", {
              message: "joined Cource successfully!!",
              courses: [...updatedStudent.courses],
            });
          }
        } else {
          io.to("studentdashboard").emit("joinCourceFailed", {
            message: "you alreay have this cource!!",
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    });

    // * UNENROLL COURCE

    socket.on("unenrollcource-STUDENT", async ({ courceid, studentid }) => {
      console.log("unenroll is running!!!");
      try {
        const student = await Student.findById({ _id: studentid });
        if (student) {
          const cource1 = await Cource.findById({ _id: courceid });
          if (!cource1) {
            const updateduser = await student.deleteCource(courceid);
            console.log(updateduser);
            io.to("studentdashboard").emit("unenroll-success", {
              message: "cource unenroll succesfull!!!",
              courses: [...updateduser.courses],
            });
          } else {
            const cource__2 = await Cource.updateOne(
              { _id: courceid },
              { $pull: { courceUsers: { email: student.email } } }
            );
            const updateduser = await student.deleteCource(courceid);
            console.log(updateduser);
            io.to("studentdashboard").emit("unenroll-success", {
              message: "cource unenroll succesfull!!!",
              courses: [...updateduser.courses],
            });
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    });

    // * delete cource student

    socket.on("deletecource", async ({ courceid, instructorid }) => {
      try {
        const cource1 = await Cource.findByIdAndDelete({_id:courceid});
        console.log(cource1);
        const instructor = await Instructor.findById({_id:instructorid});
        const updatedinstructor = await instructor.deleteCource(courceid);
        console.log(updatedinstructor);
        io.to('instructordashboard').emit('deletecource-success',{message:'cource deleted successfull!!',cources:[...updatedinstructor.coursesAdded]})
      } catch (err) {
          console.log(err.message);
      }
    });


    // * ADD ATTENDANCE

    socket.on('addAttendance',async({email,courceid})=>{
        try{
            const cource = await Cource.findOne({_id:courceid});
            if(!cource){
                console.log('cource not found!!!');
            }
            else{
                const updatedCource = await cource.addattendance(email);
                io.to('courceDetails').emit('attendance-success',{courceUsers:[...updatedCource.courceUsers]})
            }
        }
        catch(err){
            console.log(err.message);
        }
    }); 


  });
};

module.exports = socketListeners;
