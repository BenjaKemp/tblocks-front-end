import io from 'socket.io-client';
  let socket;

  const sIOConnect = (nsp) => {
    try{
      console.log(nsp)
      socket = io('http://192.168.1.245:3001');

    } catch (e) {
      console.log("");
    }
  }




const socketHandler = {
  'playersOnline': cb => socket.on('players online', data => cb(data)),
  'updateClient': cb => socket.on('updateClient', data => cb(data)),
  'updateBoard': cb => socket.on('updateBoard', data => cb(data)),
  'finishGame': cb => socket.on('finishGame', data => cb(data)),
  'makePlayerAvailable': (data, option) => {
    socket.emit('makePlayerAvailable', data, option);
  },
  'keyPressed': (data) => {
    socket.emit('keyPressed', data);
  }
}

export { socketHandler, socket, sIOConnect };