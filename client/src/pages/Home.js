import React from "react";
import {Link} from 'react-router-dom';
import "./Home.css";
import onlinelearning from "../images/svg illustations/onlinelearning.svg";
import students from "../images/svg illustations/students.svg";
import classjoin from "../images/svg illustations/classjoin.svg";
import attendance from "../images/svg illustations/attendance.svg";
import teacher_conn from "../images/svg illustations/teacher-conn.svg";

const Home = () => {
  return (
    <>
      <section className="homepage">
        {/* //! below is top-div */}

        <section className="homepage__container">
          <div className="heading__div">
            <span className="app__heading__1">This is App heading</span>
            <span className="app__heading__2">This is App heading</span>
            <Link to="/register">
              <button className="signup__button">Sign Up</button>
            </Link>
          </div>

          <div className="svg__div">
            <img src={onlinelearning} className="onlinelearing"></img>
          </div>
        </section>

        {/* //! below is the aboutus div */}

        <section className="aboutus__div">
          <div></div>

          <heading className="aboutus__heading">About Us</heading>

          <div className="aboutus__img">
            <img src={students} className="students__img"></img>
          </div>
          <div className="aboutus__container">
            <p>this is about us paragraph</p>
          </div>
        </section>

        {/* //! below is the info div */}

        <section className="info__div">

        <heading className="info__heading">Features</heading>

          <div className="cards__div">
            <div className="info__card">
              <img src={classjoin}></img>

              <div className="card__info"><p> this is classjoin feature</p></div>
            </div>
            <div className="info__card">
              <img src={attendance}></img>

              <div className="card__info"><p> this is attendance feature</p></div>
            </div>
            <div className="info__card">
              <img src={teacher_conn}></img>
              <div className="card__info"><p> this is connection with teacher</p></div>
            </div>
          </div>
        </section>
        <footer className="app__footer">
          ©AttendanceManagementSystem.co
        </footer>
      </section>
    </>
  );
};

export default Home;
