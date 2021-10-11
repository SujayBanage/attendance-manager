import React,{useEffect,useState} from 'react'
import {useParams,useHistory} from 'react-router-dom';
import axios from 'axios';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CourceDetailsStudent.css';
import attendanceper from '../images/svg illustations/attendance percentage.svg';

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
  

const CourceDetailsStudent = () => {

    const history = useHistory();
    const {id,userid} = useParams();

    console.log(userid);

    const [info,setInfo] = useState({courcename:"",totallectures:"",currnetlectures:""});
    const [creator,setCreator] = useState({name:"",email:""});
    const [users,setUsers] = useState([]);

    useEffect(async() =>{

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
            notify(res.data.message,res.data.success);
            setCreator({name:res.data.data.courceCreator.name, email:res.data.data.courceCreator.email})
            setInfo({courcename:res.data.data.courceName,totallectures:res.data.data.totalLectures,currentlectures:res.data.data.currentLectures})
            setUsers(res.data.data.courceUsers)
        }else{
            console.log(res.data.message);
            notify(res.data.message,res.data.success)
        }

    },[history])


    return (
        <>
        <div className="wrapper">
            <header>this is student cource details</header>

            <img src={attendanceper}></img>

           <div className="cource__details">
            <h2 className="info"> cource creator : {creator.name}</h2>
            <h2 className="info"> cource creator email  : {creator.email}</h2>
            <h2 className="info"> cource-Name : {info.courcename}</h2>
            <h2 className="info"> currentlectures : {info.currentlectures}</h2>
            {
                users.length!==0 ? (
                users.map((user)=>{

                    if(user.id === userid){

                        console.log(user.id)
                        return(
                            <>
                            <h2 className="info">name : {user.email}</h2>
                            <h2 className="info">attendance percentage</h2>   
                            {
                                info.currnetlectures===0 ? 
                            <div className="percentage__div__wrapper">
                                <div className="percentage__div" style={{height:"2rem",width:"0"}}>
                                    <h2>0%</h2>
                                </div>
                            </div> 
                                :
                        <div className="percentage__div__wrapper">
                            <div className="percentage__div" style={{height:"2rem",width:`${Math.trunc(user.attendance/info.currentlectures * 100)}%`}}>
                                <h2>{Math.trunc(user.attendance/info.currentlectures * 100)} %</h2>
                            </div>
                        </div>
                            }
                            {/* <h2>attendance percentage : {Math.trunc(user.attendance/info.currentlectures * 100)} %</h2> */}
                            <h2> no of lectures attendaned : {user.attendance}</h2>
                            </>
                        )
                    }
                }
                )):(<h1>
                    No users!!!
                </h1>)
            }
           </div>  
        </div>
        <ToastContainer/>
        </>
    )
}

export default CourceDetailsStudent;
