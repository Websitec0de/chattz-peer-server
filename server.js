const express = require('express');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors({
  origin: ['https://chattz.net', 'https://www.chattz.net'],
  methods: ['GET', 'POST'],
}));

const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
  debug: process.env.NODE_ENV !== 'production',
  path: '/peerjs',
});

app.use('/chattz', peerServer);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

process.on('SIGINT', () => {
  console.log('Shutting down PeerJS server...');
  server.close(() => process.exit(0));
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`PeerJS server running on port ${process.env.PORT || 3000}`);
});
