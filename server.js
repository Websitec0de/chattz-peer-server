const { ExpressPeerServer } = require('peer');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Listening...');
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs'
});

app.use('/chattz', peerServer);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
