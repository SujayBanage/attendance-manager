import React, { useEffect, useState ,useContext} from "react";
import axios from "axios";
import { FormControl, InputLabel, Input } from "@material-ui/core";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, Link } from "react-router-dom";
import './StudentDashboard.css';
import studentdashboard from '../images/svg illustations/studentdashboard.svg';
import { socketContext } from "../index.js";

const notify =(message,success) =>{
  if(success===true){
    return toast.success(message,{
      autoClose:2000
    });
  }else if(success===false){
   return toast.error(message,{
     autoClose:2000
   });
  }
  else{
    return toast(message,{
      autoClose:2000
    });
  }
}


const StudentDashboard = () => {
  const history = useHistory();
  const socket = useContext(socketContext);

  const [info, setInfo] = useState({ id:"",name: "", email: "", courses: [] });

  const [input ,setInput] = useState('');

  const token = sessionStorage.getItem("authToken");

  useEffect(()=>{
    socket.emit('join',{roomname:'studentdashboard'})
    return ()=>{
      socket.off();
    }
  },[socket])

  socket.on('joinCourceSuccess',({message,courses})=>{
    console.log('joinCourceSuccess is running!!!!!');
    notify(message,true)
    setInfo({...info,courses:[...courses]});
  })
  
  socket.on('joinCourceFailed',({message})=>{
    notify(message,false)
    console.log('joinCourcefailed is running!!!!!');
  })
  
  socket.on('unenroll-success',({message,courses})=>{
    console.log('unenroll success is running!!!!!');
    notify(message,true)
    setInfo({...info,courses:[...courses]});
  })


  
  useEffect(async () => {
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    };
    if (token) {
      // const res = await axios.get("https://attendance-manager-mern.herokuapp.com/api/private/getStudentData", config);
      const res = await axios.get("http://localhost:8000/api/private/getStudentData", config);
      console.log(res.data);
      if (res.data === "") {
        history.push("/login");
      }
      setInfo({
        ...info,
        id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        courses: res.data.courses,
      });
    } else {
      history.push("/login");
    }
  }, [history]);

  const logOutHandler = () => {
    sessionStorage.removeItem("authToken");
    history.push("/");
  };

  const inputChangeHandler = (e) => {
    setInput(e.target.value);
  }

  // const joinCourceHandler = async(e) => {

  //   const config = {
  //     headers:{
  //       "content-type": "application/json",
  //       "Authorization":`Bearer ${token}`
  //     }
  //   }

  //   const payload = {
  //     courcekey : input,
  //   }


  //   e.preventDefault();

  //   // const res = await axios.post('https://attendance-manager-mern.herokuapp.com/api/private/joinCource',payload,config);
  //   const res = await axios.post('http://localhost:8000/api/private/joinCource',payload,config);
  //   console.log(res);
  //   if(res.data.success===true) {
  //     setInput('');
  //     notify(res.data.message,res.data.success);
  //   }
  //   else{
  //     notify(res.data.message,res.data.success);
  //   }

  // }

  const joinCourceHandler=()=>{
    socket.emit('joinCource',{courcekey:input,studentid:info.id});
  }

  const unenrollHandler=(e)=>{
      const id = e.target.dataset.id;
      socket.emit('unenrollcource-STUDENT',{courceid:id,studentid:info.id});
  }

  const detailsHandler =(e)=>{
    const id = e.target.dataset.id;
    console.log(id);
    history.push(`/studentcourcedetails/${id}/${info.id}`);
  }

  // const unenrollHandler =async(e)=>{
  //   const id = e.target.dataset.id;
  //   console.log(id);
  //   // const update = info.courses.filter((cource)=>{
  //     // return cource.id != id;
  //   // })

  //   // console.log(update);

  //   // setInfo(update);

  //   // console.log(info.courses);

  //   const config={
  //     headers:{
  //       "content-type": "application/json",
  //       "Authorization":`Bearer ${token}`
  //     }
  //   }

  //   // const res = await axios.delete(`https://attendance-manager-mern.herokuapp.com/api/private/deleteCource/${id}`,config);
  //   const res = await axios.delete(`http://localhost:8000/api/private/deleteCource/${id}`,config);
  //   console.log(res);
  //   if(res.data.success===true){
  //     notify(res.data.message,res.data.success);
  //     // window.location.reload();
  //   }else{
  //     notify(res.data.message,res.data.success);
  //   }
    
  // }


  return (
    <>

    <div className="wrapper">
      <button variant="contained" color="secondary" onClick={logOutHandler} id="logout">
        LOG-OUT
      </button>
    <div className="box">
      <div className="header">
          <header>StudentDashboard </header>
          <img src={studentdashboard} id="headerimg"></img>
          <h1> Hello {info.name}</h1>
          <h1>email : {info.email}</h1>
      </div>
        
      <div>

      <header>Your Cources</header>
        
        <div className="student__cources">
        

          {info.courses !== undefined ? (
            info.courses.map((cource) => {
              return (
                <div className="student__cource__card">
                  <h1>{cource.coursename}</h1>
                 <div className="btn-div">
                  <button data-id={cource.id} data-userid={info.id} onClick={detailsHandler} id="details">DETAILS</button>
                  <button id="unenroll" data-id={cource.id} onClick={unenrollHandler}>UN-ENROLL</button>
                 </div> 
                </div>
              )
            })
          ) : (
            <h1>no cources</h1>
          )}
        </div>  
        </div>
      </div>

      <div className="join__cource__div">
        <form onSubmit={joinCourceHandler}>
          <FormControl margin="dense">
            <InputLabel htmlFor="courceKey">enter cource key...</InputLabel>
            <Input
              id="courcekey"
              name="courceKey"
              onChange={inputChangeHandler}
              value={input}
            />
          </FormControl>
          <button variant="contained" color="primary" type="submit" id="joincource">JOIN COURCE</button>
        </form>
      </div>
    </div>
    <ToastContainer/>     
    </>
  );
};

export default StudentDashboard;
