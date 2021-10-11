import React ,{useState}from "react";
import {useHistory ,Link} from "react-router-dom";
import axios from 'axios';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddCource.css';

import addcource from '../images/svg illustations/addcource.svg'


const AddCource = () => {

  const history = useHistory();

  const [state,setState] = useState({courceName:"",currentLectures:"",totalLectures:""})

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

  const postData = async(e)=>{

    e.preventDefault();

    const token = sessionStorage.getItem("authToken");

    const payload = {
      courceName:state.courceName,
      currentLectures:state.currentLectures,
      totalLectures:state.totalLectures
    }

    const config = {
      headers:{
        "Content-Type": "application/json",
        "Authorization":`Bearer ${token}`
      }
    }

    try{
      // const res = await axios.post('https://attendance-manager-mern.herokuapp.com/api/private/addCource',payload,config);
      const res = await axios.post('http://localhost:8000/api/private/addCource',payload,config);

      console.log(res);

      if(res.data.success===true){
        notify(res.data.message,res.data.success);
        setState({courceName:'',currentLectures:'',totalLectures:''});
        // history.push('/instructordashboard')
      }
      else{
        notify(res.data.message,res.data.success);
      }


    }
    catch(err){
      console.log(err)
    }

  }


  const inputChangeHandler =(e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setState({...state,[name]:value});
  }


  return (

    <>
  <div className="container">

    <header>Add New Cource</header>

    <img src={addcource}></img>
    <form className="add_cource_form" onSubmit={postData}>
      <div margin="dense">
        <label htmlFor="courceName">cource name</label>
        <input id="courceName" name="courceName"  onChange={inputChangeHandler} value={state.courceName}/>
      </div>
      <div margin="dense">
        <label htmlFor="totalLectures">total lectures</label>
        <input id="courceName" name="totalLectures" type="Number" onChange={inputChangeHandler} value={state.totalLectures}/>
      </div>
      <div margin="dense">
        <label htmlFor="currentLectures">current lectures</label>
        <input id="courceName" name="currentLectures" type="Number" onChange={inputChangeHandler} value={state.currentLectures}/>
      </div>
      <button variant="contained" type="submit" color="primary" className="btn" id="addcource">Add Cource +</button>
      <Link to="/instructordashboard">
      <button variant="contained" color="secondary" id="goback">🔙GO BACK TO DASHBOARD</button>
      </Link>
    </form>
    </div>
    <ToastContainer/>
    </>
  );
};

export default AddCource;
