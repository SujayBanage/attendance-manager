import React, { useState } from "react";
import "./Register.css";
import Form from "../components/Form.js";

const Register = () => {
  const [Role, setRole] = useState("");

  const selectHandler = (e) => {
    console.log(e.target.value);
    setRole(e.target.value);
  };

  return (
    <>
    <div className="form__container__div">
      <div className="select__div">
        <label for="roles">Choose a role</label>
        <select onChange={selectHandler}>
          <option value="none">NONE</option>
          <option value="student">STUDENT</option>
          <option value="instructor">INSTRUCTOR</option>
        </select>
      </div>
      {Role === "student" || Role === "instructor" ? (
        <Form role={Role} />
      ) : (
        <Form role="none"/>
      )}
    </div>
    </>
  );
};

export default Register;
