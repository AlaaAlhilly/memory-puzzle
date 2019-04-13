import React from 'react';

export default class Timer extends React.Component {
    render() {
      return (
        <div>
          <h1 style={{ fontSize: 20}}>{this.props.value}:{this.props.seconds}</h1>
        </div>
      );
    }
  }