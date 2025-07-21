const { ExpressPeerServer } = require('peer');
const express = require('express');

const app = express();
const server = app.listen(process.env.PORT || 3000);

const peerServer = ExpressPeerServer(server, {
  path: '/chattz'
});

app.use('/chattz', peerServer);

console.log("PeerJS server running...");