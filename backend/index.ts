import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './src/routes';
import { createServer } from "http";
import { Server } from "socket.io";
import translateHandler from "./src/socket/translateHandler";

const app = express();

const port = process.env.PORT || 3000;

// app.use(express.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cors());

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.use('/', router);

/* Error handler middleware */
app.use((err: any, req: Request, res: Response, next: Function) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  return;
});

const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: '*',
  }
});
io.on('connect', (socket) => {
  console.log(socket.id);

  translateHandler(io, socket);
})

httpServer.listen(port as number, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
// app.listen(port as number, '0.0.0.0', () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });