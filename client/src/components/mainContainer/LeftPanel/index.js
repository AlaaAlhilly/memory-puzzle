import React from 'react';
import './style.css'
function LeftPannel(props) {
    return (
        <div className="col-sm-2 col-md-2 col-lg-2 left_p">
            <img src={props.picture} alt={props.name} style={{ borderRadius: "50%" }} />
            <ul className="list-unstyled components">
                <p>{props.name}</p>
                <li className="left">Score: {props.score}</li>
                <li className="left">Highest Score: {props.highest_score}</li>
            </ul>
         </div>
    )
}
export default LeftPannel;