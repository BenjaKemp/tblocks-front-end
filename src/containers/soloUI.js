import React, { Component } from 'react';
import './soloUI.css';

class SoloUI extends Component {
  render() {
      return (
        <div className="SoloUI">
          <p className="scoreT">SCORE</p>
          <p className="scoreV">{this.props.score}</p>
          <p className="lvlT">LEVEL</p>
          <p className="lvlV">{this.props.lvl}</p>
        </div>
    );
  }
}
export default SoloUI;