import React from 'react';
import './style.css'
import uniqid from 'uniqid';
function RightPannel(props) {
    let persons = [];
    props.high_scores.forEach(person => {
        persons.push(
            <li key={uniqid()} className="list-group-item d-flex justify-content-between align-items-center">
                <img src={person.picture}alt={person.name} style={{borderRadius:"50%"}}/>
                {person.name}
                <span className="badge badge-primary badge-pill">{person.high_score}</span>
            </li>
        )
    })
    
    return (
        <div className="col-sm-2 col-md-2 col-lg-3 right_p">
            <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">High Scores:</li>
                {persons}
            </ul>
        </div>
    )
}
export default RightPannel;