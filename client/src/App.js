import React ,{lazy,Suspense} from 'react'

import {BrowserRouter as Router ,Switch ,Route} from 'react-router-dom';

import Home from './pages/Home'
const Login = lazy(()=>import("./pages/Login")) 
const Register  = lazy(()=>import("./pages/Register")) 
const InstructorDashboard = lazy(()=>import("./pages/InstructorDashboard")) ;
const StudentDashboard = lazy(()=>import("./pages/StudentDashboard")) ;
const AddCourse = lazy(()=>import("./pages/AddCource.js"))  ;
const CourceDetails = lazy(()=>import("./pages/CourceDetails.js")) ;
const CourceDetailsStudent = lazy(()=>import("./pages/CourceDetailsStudent.js")) ;
const Navbar  = lazy(()=>import("./components/Navbar.js")) 

const App = () => {
    return (
        <>
        <Router>
            <Navbar/>
            <Switch>
                <Route exact  path="/" component={Home}/>
                <Route exact path="/login">
                    <Suspense fallback={<h1>loading....</h1>}>
                        <Login/>
                    </Suspense>
                </Route>
                <Route exact path="/register">
                    <Suspense fallback={<h1>loading....</h1>}>
                        <Register/>
                    </Suspense>
                </Route>
                <Route exact path="/instructordashboard">
                    <Suspense fallback={<h1></h1>}>
                        <InstructorDashboard/>
                    </Suspense>
                </Route>
                <Route exact path="/studentdashboard" >
                    <Suspense fallback={<h1></h1>}>
                        <StudentDashboard/>
                    </Suspense>
                </Route>
                <Route exact path="/addcource">
                    <Suspense fallback={<h1></h1>}>
                        <AddCourse/>
                    </Suspense>
                </Route>
                <Route exact path="/courcedetails/:id" >
                    <Suspense fallback={<h1></h1>}>
                        <CourceDetails/>
                    </Suspense>
                </Route>
                <Route exact path="/studentcourcedetails/:id/:userid" >
                    <Suspense fallback={<h1></h1>}>
                        <CourceDetailsStudent/>
                    </Suspense>
                </Route>
            </Switch>
        </Router>
        </>
    )
}

export default App;
