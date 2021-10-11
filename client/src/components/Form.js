import React, { useState, useEffect } from "react";
import axios from "axios";
import studentsignup from '../images/svg illustations/studentsignup.svg';
import instructor from '../images/svg illustations/instructor.svg';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


import {useHistory} from 'react-router-dom';


import "./Form.css";

const Form = ({role}) => {

  const history = useHistory();

  const [error, seterror] = useState('');

  const [state, setstate] = useState({
    name: "",
    email: "",
    password: "",
    division: "",
    rollno: 0,
  });

  useEffect(() => {
    if (sessionStorage.getItem("authToken")) {
      history.push("/");
    }
  }, [history]);

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setstate({ ...state, [name]: value });
  };

  const StudentSubmitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      name: state.name,
      email: state.email,
      password: state.password,
      rollno: state.rollno,
      division: state.division,
      role: role.toString(),
    };
    // console.log(payload);

    const config = {
      headers: {
        "content-type": "application/json",
      },
    };

    try {
      // const res = await axios.post("https://attendance-manager-mern.herokuapp.com/api/auth/register", payload, config);
      const res = await axios.post(process.env.REACT_APP_URL+"/api/auth/register", payload, config);
      console.log(res);
      // console.log(data.Token);
      if(res.data.success=== true)
      {
        sessionStorage.setItem("authToken", res.data.Token);
        setstate({ email: "", password: "", name: "", division: "", rollno: 0 });
        history.push('/studentdashboard');
      }
      else{
        setstate({ email: "", password: "", name: "", division: "", rollno: 0 });
        seterror(res.data.message);
      }
      // role==="student" ? history.push('/studentdashboard') : history.push('/instructordashboard')
      
    }catch(e) {
      console.log(e.message);
    }
  };
  
  const InstructorSubmitHandler = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: state.name,
      email: state.email,
      password: state.password,
      role: role.toString(),
    };
    
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    
    try {
      // const res = await axios.post("https://attendance-manager-mern.herokuapp.com/api/auth/register", payload, config);
      const res = await axios.post(process.env.REACT_APP_URL+"/api/auth/register", payload, config);
      // console.log(data);
      // console.log(data.Token);
      console.log(res.data.success)
      if(res.data.success === false) {
        setstate({name:"",email:"",password:""});
        seterror(res.data.message);
      }
      else{
        sessionStorage.setItem("authToken", res.data.Token);
        setstate({ ...state, name: "", email: "", password: "" });
        history.push('/instructordashboard');
      }

    } catch (e) {
      console.log(e.message);
      seterror(e.message);
    }
  };

  const errorMsg = ()=>toast.info(error);
  
  if (role === "student") {
    return (
      <>
      <div className="form__div">

      <img src={studentsignup} />

        <form className="register__form" onSubmit={StudentSubmitHandler}>
          {/* /* {error ? <><h1>{error}</h1><h1> fill field again</h1></> : <h1></h1>} */ }
          {error ? ()=>{
            errorMsg()
            seterror('');
            } : null}
          <div className="formcontrol__div">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={state.name}
              fullWidth={true}
              onChange={inputChangeHandler}
            />
          </div>
          <div className="formcontrol__div">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              fullWidth={true}
              value={state.email}
              onChange={inputChangeHandler}
              color="secondary"
            />
          </div>
          <div className="formcontrol__div">
            <label htmlFor="rollno">Rollno</label>
            <input
              type="number"
              id="rollno"
              name="rollno"
              fullWidth={true}
              value={state.rollno}
              onChange={inputChangeHandler}
            />
          </div>
          <div className="formcontrol__div">
            <label htmlFor="division">Division</label>
            <input
              type="text"
              id="division"
              name="division"
              fullWidth={true}
              value={state.division}
              onChange={inputChangeHandler}
            />
          </div>
          <div className="formcontrol__div">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              fullWidth={true}
              value={state.password}
              onChange={inputChangeHandler}
            />
          </div>
          <button type="submit" color="secondary" variant="contained">
            SIGN UP
          </button>
        </form>
      </div>
      <ToastContainer position="top-center"/>
      </>
    );
  } else if (role === "instructor") {
    return (
      <>
      <div className="form__div">
      {error ? errorMsg() : <h1></h1>}

      <img src={instructor}/>

        <form className="register__form" onSubmit={InstructorSubmitHandler}>
          <div className="formcontrol__div">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              fullWidth={true}
              value={state.name}
              onChange={inputChangeHandler}
            />
          </div>
          <div className="formcontrol__div">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              fullWidth={true}
              value={state.email}
              onChange={inputChangeHandler}
            />
          </div>
          <div className="formcontrol__div">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              fullWidth={true}
              value={state.password}
              onChange={inputChangeHandler}
            />
          </div>
          <button type="submit" color="secondary" variant="contained">
            SIGN UP
          </button>
        </form>
      </div>
  <ToastContainer position="top-center"/>
      </>
    );
  }
  else {
    return(
      <>
      <h1>pls select any option</h1>
      </>
    )
  }
};

export default Form;
