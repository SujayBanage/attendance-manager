import React from 'react'

import {BrowserRouter as Router ,Switch ,Route} from 'react-router-dom';

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AddCourse from './pages/AddCource.js';
import CourceDetails from './pages/CourceDetails.js';
import CourceDetailsStudent from './pages/CourceDetailsStudent.js';
import Navbar from './components/Navbar.js'

const App = () => {
    return (
        <>
        <Router>
            <Navbar/>
            <Switch>
                <Route exact  path="/" component={Home}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/instructordashboard" component={InstructorDashboard}/>
                <Route exact path="/studentdashboard" component={StudentDashboard}/>
                <Route exact path="/addcource" component={AddCourse}/>
                <Route exact path="/courcedetails/:id" component={CourceDetails}/>
                <Route exact path="/studentcourcedetails/:id/:userid" component={CourceDetailsStudent}/>
            </Switch>
        </Router>
        </>
    )
}

export default App;
