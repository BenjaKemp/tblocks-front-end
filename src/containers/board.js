import React, { Component } from 'react';
import './board.css';
import { connect } from 'react-redux';
import { finishGame, backToSel } from '../actions/index';
import { socket } from '../socketCommunication';

class Board extends Component {
  constructor(props){
    super(props)
    if (this.props.music) this.props.music.play();
    this.buttonStyle = {
      display: 'none',
    }
  }
  componentDidMount() {
    this.tetrisCanvas = this.refs.tetrisCanvas;
    this.tetrisCanvasContext = this.tetrisCanvas.getContext('2d');
    this.tetrisCanvasContext.scale(20, 20);
    this.clearCanvas('#000');
    this.colors = [
      null,
      '#a000f0',    // T
      '#f0a000',    // L
      '#0000f0',    // J
      '#00f000',    // S
      '#f00000',    // Z
      '#00f0f0',    // L
      '#f0f000'     // O
    ];

  }

  shouldComponentUpdate(nextProps, nextState) {
    this.clearCanvas('#000');
    if (nextProps.piece) this.drawMatrix(nextProps.boardStatus, {x:0,y:0});
    else if ( this.props.piece ) this.drawMatrix(this.props.boardStatus, {x:0,y:0});
    if (nextProps.piece) this.drawMatrix(nextProps.piece.matrix, nextProps.piece.pos);
    else if ( this.props.piece ) this.drawMatrix(this.props.piece.matrix, this.props.piece.pos);

    if(nextProps.gameStatus === 'Game Over'){
      this.buttonStyle = {
        display:'block',
        width: '240px',
        fontSize: '30px',
      }
      socket.disconnect();
      return true;
    }
    return false;
  }
  clearCanvas(color = '#000') {
    // Make sure the image is loaded first otherwise nothing will draw.
    this.tetrisCanvasContext.drawImage(this.props.bg,0,0,12,20);
    // this.tetrisCanvasContext.fillStyle = color;
    // this.tetrisCanvasContext.fillRect(0,0,this.tetrisCanvas.width,this.tetrisCanvas.height);
  }
  drawBorder(xPos, yPos, width, height, thickness = 1)
  {
    this.tetrisCanvasContext.fillStyle='#000';
    this.tetrisCanvasContext.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
  }
  drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.drawBorder(x + offset.x,
            y + offset.y,
            1,
            1,0.01)
          this.tetrisCanvasContext.fillStyle = this.colors[value];
          // this.tetrisCanvasContext.fillStyle = 'lightblue';
          this.tetrisCanvasContext.fillRect(x + offset.x,
            y + offset.y,
            1,
            1);
        }
      })
    })
  }
  showGameResults() {
    if (this.props.gameStatus === 'Game Over') {
      return (
        <div className="END">
          <p>{this.props.message}</p>
        </div>
      )
    } else {
      return;
    }
  }
  //<img src="memeBlyat.gif" className="fRowDest" alt="blyat" style={{display: 'none'}}/>
  render() {
      return (
        <div className="div-board">
          <p className="PJName">{this.props.player.name}</p>
          <canvas width="240" height="400" ref="tetrisCanvas"></canvas>
          {this.showGameResults()}
          <button style={this.buttonStyle} className="button" onClick={(e)=>this.props.backToSel()}>Continue</button>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    gameStatus: state.gameStatus,
    move: state.move
  }
}

const mapDispatchToProps = (dispatch) => ({
  finishGame: (player) => dispatch(finishGame()),
  backToSel:  ()=>dispatch(backToSel())
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
