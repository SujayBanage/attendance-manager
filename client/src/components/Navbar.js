import React,{useState} from 'react'
import {NavLink} from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import './Navbar.css';


const Navbar = () => {

    const [state,setState] = useState({clicked:false});

    const navHandler = ()=>{
        setState({clicked:!state.clicked});
    }

    return (
        <div className={state.clicked ? 'navbar-active' : 'navbar'}>
            <div className={state.clicked ? 'active-navbar-links' : 'navbar__links'}>
                <NavLink className={state.clicked ? 'active-links':''}to="/">HOME</NavLink>
                <NavLink className={state.clicked ? 'active-links':''}to="/register">REGISTER</NavLink>
                <NavLink className={state.clicked ? 'active-links':''}to="/login">LOGIN</NavLink>
                <NavLink className={state.clicked ? 'active-links':''}to="/studentdashboard">STUDENTDASHBOARD</NavLink>
                <NavLink className={state.clicked ? 'active-links':''}to="/instructordashboard">INSTRUCTORDASHBOARD</NavLink>
            <button className="hamburger-button" onClick={navHandler}>
                {
                    state.clicked ? <CloseIcon/> : <MenuIcon/>
                }
            </button>
            </div>
        </div>
    )
}

export default Navbar;
