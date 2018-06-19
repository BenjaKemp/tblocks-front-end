import {START_GAME, FINISH_GAME, UPDATE_CLIENT_BOARD, UPDATE_CLIENT_STATUS, UPDATE_PLAYER_COUNT, MOVE_LEFT, MOVE_RIGHT, MOVE_DOWN, DROP_DOWN, ROTATE, COLLTOFALS, ROWDESTFALS, FROWDESTFALS } from "../constants/action-types";


const initialState = {
  gameStatus: 'Playing',
  message: {},
  move: null,
  playerCount: 0,
  availablePlayers: [],
  clientStatus: 'welcome',
  player01: null,
  //player02: null,
  opponents: null,
  opponentsBP: {},
  playerBoard: null,
  playerPiece: {
    pos: {},
    matrix: [],
    score: 0,
    level: 0,
    collision: false,
    rowDest: false,
    fRowDest: false,
  },
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
  case START_GAME:
    return state;
  case 'UPDATE_LIST_OF_PLAYERS':
    return {
      ...state,
      playerCount: action.playerCount,
    }

  case UPDATE_CLIENT_BOARD:
  if (state.player01.id === action.data.playerID) {
    return {
      ...state,
      playerBoard: action.data.board,
      playerPiece: action.data.player
    }
  } else {
      const aux = {...state.opponentsBP}
        aux[action.data.playerID] = {
          opponentsBoard: action.data.board,
          opponentsPiece: action.data.player
        }
    return {
      ...state,
      opponentsBP: aux,
    }
  }


  case UPDATE_CLIENT_STATUS:
    const aux = {...state.oponentsBP}
    if ( action.data.player ){
      aux[action.data.player.id] = {};
    }
    return {
      ...state,
      clientStatus: action.data.status,
      player01: action.data.player,
      opponents: action.data.opponents,
      opponentsBP: aux,
    }

  case UPDATE_PLAYER_COUNT:
    return {
      ...state,
      playerCount: action.playerCount
    }
  case  MOVE_LEFT:
    return {
      ...state,
      move: 'left'
    }
  case MOVE_RIGHT:
    return {
      ...state,
      move: 'right'
    }
  case ROTATE:
    return {
      ...state,
      move: 'rotate'
    }
  case MOVE_DOWN:
    return {
      ...state,
      move: 'down'
    }
  case DROP_DOWN:
    return {
      ...state,
      move: 'drop'
    }
  case FINISH_GAME:
    if (state.gameStatus === 'Game Over') {
      return {
        ...state
      }
    } else {
      return {
        ...state,
        gameStatus: 'Game Over',
        message: action.data
      };
    }
  case COLLTOFALS:
    return {
      ...state,
      playerPiece: {
        ...state.playerPiece,
        collision: false
      }
    }
  case ROWDESTFALS:
  return {
    ...state,
    playerPiece: {
      ...state.playerPiece,
      rowDest: false
    }
  }
  case FROWDESTFALS:
  return {
    ...state,
    playerPiece: {
      ...state.playerPiece,
      fRowDest: false
    }
  }
  default:
    return state;
  }
};

export default rootReducer;
