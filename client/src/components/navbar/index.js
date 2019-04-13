import React from 'react';
import './style.css';
import Timer from '../Timer';

function Navbar(props) {
    return (
        <nav className="navbar">
            <ul>
                <li className="brand">
                    <a href="/">Memory Game</a>
                </li>
                <li >
                    <Timer value={props.value} seconds={props.seconds}/>
                </li>
                
            </ul>
        </nav>
    )
};

export default Navbar;