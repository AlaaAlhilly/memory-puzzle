import React from 'react';
import './style.css';

function Container(props) {
    let name = props.name;
    if (props.className === "guessed" && props.disabled === "true") {
            return (
                <div
                    role="img"
                    className="click-item"
                    name={props.name}
                    style={{ backgroundImage: "url(" + props.src + ")" }}>
                </div>
             )
    } else {
        return (
            <div
                role="img"
                className="click-item"
                name={props.name}
                onClick={() => props.handleClickEvent(name, props.index)}
                style={{ backgroundImage: "url(" + props.src + ")" }}>
            </div>
        )
    }
}
export default Container;