const express = require('express');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');
const http = require('http');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors({
  origin: ['https://chattz.net', 'https://www.chattz.net'],
  methods: ['GET', 'POST'],
}));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many requests. Try again later.',
});
app.use('/chattz', limiter);

app.use('/chattz', (req, res, next) => {
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';
  const allowed = ['https://chattz.net', 'https://www.chattz.net'];

  if (req.path === '/peerjs/id' && req.method === 'GET') return next();
  if (!allowed.some(a => origin.startsWith(a) || referer.startsWith(a))) {
    return res.status(403).send('Forbidden: invalid origin');
  }
  next();
});

const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
  debug: process.env.NODE_ENV !== 'production',
  path: '/peerjs',
});

app.use('/chattz', peerServer);

app.get('/health', (req, res) => res.status(200).send('OK'));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => process.exit(0));
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
