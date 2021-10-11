import React, { useState , useEffect } from "react";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./Login.css";
import login from '../images/svg illustations/login.svg';

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





const Login = ({history}) => {
  const [role, setrole] = useState("");

  const [state, setstate] = useState({email:"", password:"",error:""});

  useEffect(()=>{

    if(sessionStorage.getItem('authToken'))
    {
      history.push("/")
    }

  },[history]);

  
  const ChangeHandler = (e) => {
    console.log(e.target.value);
    setrole(e.target.value);
  };

  const inputChangeHandler=(e) => {
    const name = e.target.name;
    const value = e.target.value;
    setstate({...state,[name]:value});
  }


  const LoginHandler = async(e)=>{

    e.preventDefault();

    const payload = {
      email: state.email,
      password: state.password
    }

    const config = {
      headers:{
        "content-type": "application/json"
      }
    }

    let REQ_URL;

    if(role==="student")
    {
      // REQ_URL = "https://attendance-manager-mern.herokuapp.com/api/auth/studentlogin";
      REQ_URL = "http://localhost:8000/api/auth/studentlogin";
    }
    else{
      // REQ_URL = "https://attendance-manager-mern.herokuapp.com/api/auth/instructorlogin";
      REQ_URL = "http://localhost:8000/api/auth/instructorlogin";
    }

    try{
        const res = await axios.post(REQ_URL,payload,config);
        console.log(res);
        if(res.data.success === false) {
          setstate({email:"",password:"",error:res.data.message})
          notify(res.data.message,res.data.success);
        }else{
          console.log(res.data.Token);
          sessionStorage.setItem("authToken",res.data.Token);
          role==="student" ? history.push('/studentdashboard') : history.push('/instructordashboard');
        }
      }
      catch(e){
        console.log(e.message);
        setstate({...state, error: e.message});
        notify(e.message,false);
    }

  }





  return (
    <>
    <div className="login">
      <div className="select__div">
        <label for="roles">Choose a role</label>
        <select onChange={ChangeHandler}>
          <option value="none">NONE</option>
          <option value="student">STUDENT</option>
          <option value="instructor">INSTRUCTOR</option>
        </select>
      </div>
      {role === "student" ? (
        <>
        <div className="login__form__div">
          <h1>Login</h1>
          <img src={login}></img>

            <form className="login__form" onSubmit={LoginHandler}>
              <div className="formcontrol__div">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" fullWidth={true} value={state.email}
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
                  onChange={inputChangeHandler}
                  value = {state.password}
                />
              </div>
              <button type="submit" color="secondary" variant="contained">LOGIN AS STUDENT</button>
            </form>
          </div>
        </>
      ) : (
        <>
        <div className="login__form__div">
        <h1>Login</h1>
          <img src={login}></img>
            <form className="login__form" onSubmit={LoginHandler}>
              <div className="formcontrol__div">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" fullWidth={true}
                value={state.email}
                onChange={inputChangeHandler} />
              </div>
              <div className="formcontrol__div">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  fullWidth={true}
                  onChange={inputChangeHandler}
                  value = {state.password}
                />
              </div>
            <button type="submit" color="secondary" variant="contained">LOGIN AS INSTRUCTOR</button>
            </form>
          </div>
        </>
      )}
    </div>
        <ToastContainer/>
    </>
  );
};

export default Login;
