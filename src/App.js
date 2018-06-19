import React, { Component } from 'react';
import { startGame, finishGame, updateClientBoard, updateClientStatus, updatePlayerCount, requestMoveLeft, requestMoveRight, requestMoveDown, requestDropDown, requestRotate, collisionToFalse, rowDestToFalse, fRowDestToFalse } from "./actions/index";
import './App.css';
import ReactDOM from 'react-dom';
import Board from './containers/board';
import SoloUI from './containers/soloUI';
import { socketHandler } from './socketCommunication';
import { connect } from 'react-redux';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {selection: false};
    socketHandler['playersOnline']((playerCount) => {
      this.props.updatePlayerCount(playerCount);
    });

    socketHandler['updateClient']((data) => {
      this.props.updateClientStatus(data);
    });

    socketHandler['updateBoard']((data) => {
      this.props.updateClientBoard(data);
    });

    socketHandler['finishGame']((data) => {
      this.props.finishGame(data);
    });

    //Name intro
    this.nameIntroduced = '';
    this.optionSelected = 0;

    //handling music
    this.music = new Audio( 'tetris.mp3' );
    this.music.loop = true;
    this.music.muted = true;
    this.musicList = ['tetris.mp3','badger2.mp3'];
    this.selectedmusic = 0;

    this.myRef = React.createRef();
    this.myRef2 = React.createRef();
    this.gifRef = React.createRef();

    this.backgroundPlayer = new Image();
    this.backgroundPlayer.src = "BGP.jpg";
    this.backgroundOpponents = new Image();
    this.backgroundOpponents.src = "BGO.jpg";

  }
  componentDidUpdate(){
    if (this.props.playerPiece.collision) {
      new Audio('impact.mp3').play();
      this.props.setCollisionToFalse();
    }
    if (this.props.playerPiece.rowDest) {
      let aud = new Audio('crash.mp3');
      aud.volume = 0.5;
      aud.play();
      this.props.playerPiece.rowDest = false;
    }
    if (this.props.playerPiece.fRowDest) {
      let gif = this.gifRef.current;
      gif.style = {display:'block'};
      setTimeout((gif)=>{
        gif.style.display= 'none';
      },5000,gif);
      this.props.setfRowDestToFalse();
    }

  }
  focusDiv() {
    ReactDOM.findDOMNode(this.refs.board).click();
    ReactDOM.findDOMNode(this.refs.board).focus();
  }

  handleKeyPress = (event) => {
    if (this.props.clientStatus === 'pair') {
      if(this.props.gameStatus !== 'Game Over' && !this.props.playerPiece.dead) {
        if(event.key === 'ArrowLeft'){
          socketHandler['keyPressed']({"key":'left', "player": this.props.player01});
          this.props.requestMoveLeft();
        }
        if(event.key === 'ArrowRight'){
          socketHandler['keyPressed']({"key":'right', "player": this.props.player01});
          this.props.requestMoveRight();
        }
        if(event.key === 'ArrowUp'){
          socketHandler['keyPressed']({"key":'up', "player": this.props.player01});
          this.props.requestRotate();
        }
        if(event.key === 'ArrowDown'){
          socketHandler['keyPressed']({"key":'down', "player": this.props.player01});
          this.props.requestMoveDown();
        }
        if(event.key === ' '){
          socketHandler['keyPressed']({"key":'spacebar', "player": this.props.player01});
          this.props.requestDropDown();
        }
      }
      if(event.key === 'm'){
        this.music.muted ? this.music.muted = false : this.music.muted = true;
      }
      if(event.key === 'M'){
        this.selectedmusic === 0 ? this.selectedmusic = 1 : this.selectedmusic = 0;
        this.music.src = this.musicList[this.selectedmusic];
        this.music.load();
        this.music.play();
      }
    }
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

  goAndSelectGame() {
    new Audio('shotgun.mp3').play();
    this.setState({selection: true});
    this.nameIntroduced = this.refs.name.value;
  }

  lookForAnOpponentClicked(option) {
    new Audio('shotgun.mp3').play();
    this.optionSelected = option;
    socketHandler['makePlayerAvailable'](this.nameIntroduced,option)
  }

  getMessagePlayer(){
    if (this.props.player01 !== null) {
      return 'YOU ' + this.props.message[this.props.player01.id];
    }
    return '';
  }
  getMessageOpp(id){
    if (id.id !== undefined) {
      return id.name + ' ' + this.props.message[id.id];
    }
    return '';
  }
  getOppBoard(id){
    if (this.props.opponentsBP[id.id]!== undefined) {
      return this.props.opponentsBP[id.id].opponentsBoard;
    }
    return null;
  }
  getOppPiece(id){
    if (this.props.opponentsBP[id.id]!== undefined) {
     return this.props.opponentsBP[id.id].opponentsPiece;
    }
    return null;
  }

  renderView() {
    if (this.props.clientStatus === 'welcome' && !this.state.selection) {
      return (
        <div className="App" onKeyDown={this.handleKeyPress} tabIndex="0">
          <h1 style={{color: '#C90E17'}}>Comrade</h1>
          <form onSubmit={(e)=>{e.preventDefault(); this.goAndSelectGame()}}>
            <p>Comrades Ready: {this.props.playerCount}</p>
            <input placeholder="введите ваше имя" ref="name"/>
            <br />
            <br />
            <button type="submit" className="button" >Enlist Now!</button>
          </form>

        </div>
      );
    } else if (this.props.clientStatus === 'welcome' && this.state.selection ) {
      return (
        <div className="App" onKeyDown={this.handleKeyPress} tabIndex="0">
          <h1 style={{color: '#C90E17'}}>Comrade</h1>
          <button className="button" onClick={(e)=>this.lookForAnOpponentClicked('1')}>1 Player</button>
          <br />
          <br />
          <button className="button" onClick={(e)=>this.lookForAnOpponentClicked('2')}>1 Vs 1</button>
          <br />
          <br />
          <button className="button" onClick={(e)=>this.lookForAnOpponentClicked('3')}>FFA (3P)</button>
        </div>
      );
    } else if (this.props.clientStatus === 'wait') {
      return (
        <div className="App" onKeyDown={this.handleKeyPress} tabIndex="0">

          <div className="orders-container">

          <p className="line-1 anim-typewriter">Greetings komrade, we have intercepted an</p>
          <p className="line-1 anim-typewriter1">encoded transmission from Ze Germans or the Argies</p>
          <p className="line-1 anim-typewriter2">and probably at least one fucking Fin,</p>
          <p className="line-1 anim-typewriter3">please use your superior coding knowledge to break</p>
          <p className="line-1 anim-typewriter4">the lines of code</p>

        </div>
      </div>
      );
    } else if (this.props.clientStatus === 'pair' && this.optionSelected === '1') {
      setTimeout(() => {
        this.focusDiv();
      },1500);

      return (
        <div className="App" onKeyDown={this.handleKeyPress} tabIndex="0" ref="board">
          <div className="App-SoloScene">
            <SoloUI score={ this.props.playerPiece.score } lvl={ this.props.playerPiece.level }/>
            <Board
              ref={this.myRef}
              bg={this.backgroundPlayer}
              music={this.music}
              player={this.props.player01}
              boardStatus={this.props.playerBoard}
              piece={this.props.playerPiece}
              message="GAME OVER"/>
          </div>
          <img ref={this.gifRef} src="memeBlyat.gif" className="fRowDest" alt="blyat" style={{display: 'none'}}/>

        </div>
      );
    } else if (this.props.clientStatus === 'pair' && this.optionSelected === '2') {
      setTimeout(() => {
        this.focusDiv();
      },1500);

      //
      //  <p style={{color: 'white'}}>{this.props.playerPiece.score } { this.props.player01.name}, you've been paired with {this.props.opponents[0].name}</p>
      //
      //
      return (
        <div className="App" onKeyDown={this.handleKeyPress} tabIndex="0" ref="board">
          <div className="App-VSScene">
            <Board
              ref={this.myRef}
              bg={this.backgroundPlayer}
              music={this.music}
              player={this.props.player01}
              boardStatus={this.props.playerBoard}
              piece={this.props.playerPiece}
              message={this.getMessagePlayer()}/>
            <Board
              player={ this.props.opponents[0] }
              bg={this.backgroundOpponents}
              boardStatus={this.getOppBoard(this.props.opponents[0])}
              piece={this.getOppPiece(this.props.opponents[0])}
              message={this.getMessageOpp(this.props.opponents[0])}/>
              />
          </div>
        </div>
      );
    } else if (this.props.clientStatus === 'pair' && this.optionSelected === '3') {
      setTimeout(() => {
        this.focusDiv();
      },1500);

      //
      //  <p style={{color: 'white'}}>{this.props.playerPiece.score } { this.props.player01.name}, you've been paired with {this.props.opponents[0].name} and {this.props.opponents[1].name}</p>

      return (
        <div className="App" onKeyDown={this.handleKeyPress} tabIndex="0" ref="board">
          <div className="App-FFAScene">
            <Board
              ref={this.myRef}
              bg={this.backgroundPlayer}
              music={this.music}
              player={this.props.player01}
              boardStatus={this.props.playerBoard}
              piece={this.props.playerPiece}
              message={this.getMessagePlayer()}
            />
            <Board
              player={ this.props.opponents[0] }
              bg={this.backgroundOpponents}
              boardStatus={this.getOppBoard(this.props.opponents[0])}
              piece={this.getOppPiece(this.props.opponents[0])}
              message={this.getMessageOpp(this.props.opponents[0])}
              />
            <Board
              player={this.props.opponents[1]}
              bg={this.backgroundOpponents}
              boardStatus={this.getOppBoard(this.props.opponents[1])}
              piece={this.getOppPiece(this.props.opponents[1])}
              message={this.getMessageOpp(this.props.opponents[1])}
              />
          </div>
        </div>
      );
    } else {
      return (<p style={{color: 'white'}}>Something unexpected happened</p>);
    }
  }

  render() {
    return this.renderView()
  }
}

const mapStateToProps = (state) => {
  return {
    gameStatus: state.gameStatus,
    message: state.message,
    playerCount: state.playerCount,
    clientStatus: state.clientStatus,
    player01: state.player01,
    opponents: state.opponents,
    playerBoard: state.playerBoard,
    playerPiece: state.playerPiece,
    opponentsBP: state.opponentsBP,
  }
}

const mapDispatchToProps = (dispatch) => ({
    startGame: () => dispatch(startGame()),
    finishGame: (data) => dispatch(finishGame(data)),
    updateClientBoard: (data) => dispatch(updateClientBoard(data)),
    updateClientStatus: (data) => dispatch(updateClientStatus(data)),
    updatePlayerCount: (playerCount) => dispatch(updatePlayerCount(playerCount)),
    requestMoveLeft: () => dispatch(requestMoveLeft()),
    requestMoveRight: () => dispatch(requestMoveRight()),
    requestMoveDown: () => dispatch(requestMoveDown()),
    requestDropDown: () => dispatch(requestDropDown()),
    requestRotate: () => dispatch(requestRotate()),
    setCollisionToFalse: ()=> dispatch(collisionToFalse()),
    setRowDestToFalse: ()=> dispatch(rowDestToFalse()),
    setfRowDestToFalse: ()=> dispatch(fRowDestToFalse()),

});

export default connect(mapStateToProps, mapDispatchToProps)(App);
