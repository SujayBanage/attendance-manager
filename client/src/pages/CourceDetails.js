import React ,{useEffect,useState,useContext} from 'react';
import {useParams,useHistory} from 'react-router-dom';
import axios from 'axios';
import "./CourceDetails.css";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import courceinfo from '../images/svg illustations/instructorcourceinfo.svg';
import addattendance from '../images/svg illustations/add attendance.svg';
import {socketContext} from '../index.js'
const notify =(message,success) =>{
    if(success===true){
      return toast.success(message,{
        autoClose:2000,
        toastId:'success'
      });
    }else if(success===false){
     return toast.error(message,{
       autoClose:2000,
       toastId:'fail'
     });
    }
    else{
      return toast(message,{
        autoClose:2000,
        toastId:'no'
      });
    }
  }

const CourceDetails = () => {

  const socket = useContext(socketContext);

    const history = useHistory();
    const {id} = useParams();
    const [courceDetails,setCourceDetails] = useState({courcename:"",courcecreator:"",courcekey:"",currentlectures:"",totallectures:""});
    const [courceUsers,setCourceUsers] = useState([]);

    useEffect(()=>{
      socket.emit('join',{roomname:'courceDetails'})
      return ()=>{
        socket.off();
      }
    },[socket])

    socket.on('attendance-success',({courceUsers})=>{
      notify('added attendance successfully!!',true);
      setCourceUsers([...courceUsers]);
    })


    const getCourceData = async()=>{

        const token = sessionStorage.getItem("authToken");

        const config = {
            headers:{
                "content-type": "application/json",
                "Authorization":`Bearer ${token}`
            }
        }

        // const res = await axios.get(`https://attendance-manager-mern.herokuapp.com/api/private/getCourceData/${id}`,config);
        const res = await axios.get(`http://localhost:8000/api/private/getCourceData/${id}`,config);
        console.log(res);
        if(res.data.success === true){
            setCourceDetails({courcename:res.data.data.courceName,courcecreator:res.data.data.courceCreator.email,courcekey:res.data.data.courceKey,currentlectures:res.data.data.currentLectures,totallectures:res.data.data.totalLectures})
            setCourceUsers([...res.data.data.courceUsers]);
            console.log(courceUsers);
        }
        else{
            console.log("error ocuured!!");
        }
    }
    useEffect(() => {
        getCourceData();
    },[history]);


    // const attendanceHandler = async(e) =>{

    //   if(courceDetails.currentlectures===0){
    //     notify("pls increase the current lectures",false)
    //   }else{
    //     const email = e.target.dataset.email;
    //     console.log(email);
    //     // const res = await axios.patch(`https://attendance-manager-mern.herokuapp.com/api/private/addAttendance/${id}/${email}`);
    //     const res = await axios.patch(`http://localhost:8000/api/private/addAttendance/${id}/${email}`);
    //     console.log(res);
    //     notify(res.data.message,res.data.success);
    //   }
    // }

    const attendanceHandler=(e)=>{
      const email = e.target.dataset.email;
      const courceid = id;
      socket.emit('addAttendance',{email,courceid});
    }


    const lectureHandler =async(e)=>{

        courceDetails.currentLectures!=courceDetails.totallectures ? setCourceDetails({...courceDetails,currentlectures:courceDetails.currentlectures+1}) : notify("your cource is completed now");
        // const currentlectures = e.target.dataset.currentlectures;
        // const totallectures = e.target.dataset.totallectures;
        // const res = await axios.patch(`https://attendance-manager-mern.herokuapp.com/api/private/currentLectures/${id}`);
        const res = await axios.patch(`http://localhost:8000/api/private/currentLectures/${id}`);
        console.log(res);
    }

    return (
        <>
        <div className="cource__info__wrapper">

          <header>Cource Details</header>

            <img src={courceinfo} id="courceinfo"/>

            <div className="cource__info">

              <h1>Cource info</h1>

              <h1>cource name : {courceDetails.courcename}</h1>
              <h1>cource creator : {courceDetails.courcecreator}</h1>
              <h1>cource key : {courceDetails.courcekey}</h1>
              <h1>totallectures : {courceDetails.totallectures}</h1>

            </div>


            <div id="currentlectures">
                <h1>currentlectures : {courceDetails.currentlectures}</h1>
                <button variant="contained" color="primary" onClick={lectureHandler}>+</button>
            </div>




          <header>Add Attendance</header>

            <div className="image__div">

                <img src={addattendance}></img>

            </div>

        <div className="students__container" style={{display:"flex",justifyContent:"center"}}>

            {
                courceUsers.length>0 ? courceUsers.map((user)=>{
                    return (
                        <>
                          <div className="student__card">
                            <h2>email : {user.email}</h2>
                            <h2>rollno : {user.rollno}</h2>
                            <h2>attendance: {user.attendance}</h2>

                            {/* { */}
                              {/* courceDetails.currentlectures===0 ?  <button variant="contained" color="primary" onClick={attendanceHandler} data-email={user.email} disabled="true">+</button> :  <button variant="contained" color="primary" onClick={attendanceHandler} data-email={user.email}>+</button> */}
                            {/* } */}

                            <button variant="contained" color="primary" onClick={attendanceHandler} data-email={user.email}>add attendance +</button>
                          </div>  
                        </>
                    )
                }) : (<h1>No users!!</h1>)
            }

        </div>     
        </div>
        <ToastContainer/>
        </>
    )
}

export default CourceDetails;
