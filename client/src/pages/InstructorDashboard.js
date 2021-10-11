import React,{useState,useEffect,useContext} from 'react'
import {useHistory,Link} from 'react-router-dom';
import Card from '../components/Card.js';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './InstructorDashboard.css';
import instructordashboard from '../images/svg illustations/instructordashboard.svg'
import yourcources from '../images/svg illustations/yourcources.svg'
import { socketContext } from '../index.js';


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


const InstructorDashboard = () => {

    const socket = useContext(socketContext);

    const [info,setInfo] = useState({id:'',name:'',email:'',cources:[]});

    const history = useHistory()

    const token = sessionStorage.getItem('authToken');

    useEffect(()=>{
        socket.emit('join',{roomname:'instructordashboard'});
        return ()=>{
            socket.off();
        }
    },[socket])


    socket.on('deletecource-success',({message,cources})=>{
        notify(message,true);
        setInfo({...info,cources:[...cources]});
    })


    
    useEffect(async() =>{
        
        const config = {
            headers:{
                "content-type": "application/json",
                "Authorization":`Bearer ${token}`
            }
        }
        if(token) {
            // const res = await axios.get('https://attendance-manager-mern.herokuapp.com/api/private/getInstructorData',config);
            const res = await axios.get('http://localhost:8000/api/private/getInstructorData',config);
            console.log(res)
            if(res.data.success === false){
                history.push("/login");
                notify(res.data.message,res.data.success);
            }
            else{
                setInfo({...info,id:res.data._id,name:res.data.name,email:res.data.email,cources:res.data.coursesAdded});
                notify(res.data.message,res.data.success);
                // history.push("/instructordashboard");
            }
        }else{
            history.push("/login");
        }
    },[history]);

    const logOutHandler =()=>{
        sessionStorage.removeItem("authToken");
        history.push("/");
    }


    return (
        <>
        <div className="wrapper">
        <div className="instructor__info__div">
            <button variant="contained" color="secondary" onClick={logOutHandler}>LOG-OUT</button>

            <heading>Instructor Dashboard</heading>

            <img src={instructordashboard} id="instructorimg"/>

            <h1>Hello {info.name}</h1>
            <h1>email : {info.email}</h1>
        </div>


        <div className="instructor__cources__div">

            <heading>Your Cources</heading>

            <img src={yourcources} id="yourcources"/>

            <div className="cources">
                {info.cources.map((cource)=>{
                return (
                    <Card courcename={cource.courcename} courceid={cource.id} instructorid={info.id}/>
                )
                })}
            </div>

        </div> 
        <button variant="contained" color="primary" id="addcource"><Link  to="/addcource">Add Course +</Link></button>
        
        </div>    
        <ToastContainer/>
        </>
    )
}

export default InstructorDashboard;
