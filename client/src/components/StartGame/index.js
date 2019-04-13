import React from 'react';
export default class StartButton extends React.Component {
    render() {
      return (
        <div style={{ marginLeft: 130 }}>
          <button className="btn btn-lg btn-success"  onClick={this.props.startTheGame}>Start</button>
        </div>
  
      );
    }
  }