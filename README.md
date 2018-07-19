# TBlocks

![img](https://raw.githubusercontent.com/rogerknl/tblocks-front-end/develop/public/tblocs.png) 

> TBlocks is a single/multiplayer tetris-like game

## Running the game

### Online Version

The easiest way to run the game is to use the [online version](http://comrade.knl.cat) which is already
deployed to a server on the internet.

### Locally

If you want to run the game locally, you'll need to:

* Clone the repository
* Install dependencies using `npm i`
* Start the project using `npm start`
* Enjoy

*Notice*: The game will use the back-end which is already deployed to match you
with other players. If you want to run your own back-end, you'll need to clone
the [back-end repository](https://github.com/rogerknl/tblocks-back-end) as well.


## How to Play

* `Left Arrow`: Move the current piece to the left
* `Right Arrow`: Move the current piece to the right
* `Up Arrow`: Rotate the current piece
* `Down Arrow`: Move the current piece down by one unit
* `Space Bar`: Drop current piece to the bottom of the board
* `m`: Mute/unmute music
* `M`: Change music track

## Changes from the original game

* Some UI improvements
* Single player mode added
* FFA ( 3 players ) added
* Sound effects added
* Increase speed of the pieces falling based on player's performance
* Add an Attack/Perk system
  * Transfer cleared lines to the other player
* Add music to the game

## Built with

* [Express](https://expressjs.com) - Server
* [SocketIO](https://socket.io) - Web socket Communication
* [React](https://reactjs.org) - Front End framework
* [Redux](https://redux.js.org) - State Management
* [HTML Canvas](https://developer.mozilla.org/kab/docs/Web/API/Canvas_API) - Drawing of the boards

## Contributing

If you'd like to contribute to this project, feel free to open a new issue in
this repository so we can get a conversation started.

## Authors

###### Authors of actual refactor:

* ##### Benjamin Kemp - [Github]() - [LinkedIn]()

* ##### Roger Canela - [Github]() - [LinkedIn]()

###### Author of the Original Repository  

* ##### Dave Martínez - [Github](https://github.com/dkm-coder)
