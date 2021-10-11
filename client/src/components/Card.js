import React, { useEffect,useContext} from "react";
import { useHistory } from "react-router-dom";
import "./Card.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socketContext } from "../index.js";


const Card = ({ courcename, courceid ,instructorid}) => {

  const socket = useContext(socketContext);

  const history = useHistory();
  const token = sessionStorage.getItem("authToken");

  const notify = (message, success) => {
    if (success === true) {
      return toast.success(message);
    } else if (success === false) {
      return toast.error(message);
    } else {
      return toast(message);
    }
  };

  useEffect(() => {
    if (!token) {
      history.push("/login");
    }
  }, [history]);

  const detailsHandler = () => {
    history.push(`/courcedetails/${courceid}`);
  };

  // const deleteHandler = async () => {
  //   const config = {
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  //   const res = await axios.delete(
  //     // `https://attendance-manager-mern.herokuapp.com/api/private/deleteCource/${courceid}`,
  //     `https://localhost:8000/api/private/deleteCource/${courceid}`,
  //     config
  //   );
  //   console.log(res);
  //   notify(res.message, res.success);
  // };

  const deleteHandler=async()=>{
    socket.emit('deletecource',{courceid,instructorid});
  }

  return (
    <>
    <div className="card-container">
      <h1>{courcename}</h1>
      <div className="btn-div">
        <button variant="contained" color="primary" onClick={detailsHandler} id="detailsbtn">
          Details
        </button>
        <button variant="contained" color="secondary" onClick={deleteHandler} id="delete">
          Delete
        </button>
      </div>
    </div>
    <ToastContainer />
    </>
  );
};

export default Card;
