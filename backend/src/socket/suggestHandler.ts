import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import RagQAService from '../services/ragQA.service';
dotenv.config();

export default (io: Server, socket: Socket) => {
    const ragQAService = new RagQAService();
  
  socket.on('suggest_answer',async (data) => {console.log("on suggest answer");
    const stream = await ragQAService.suggest(data.text);
    for await (const chunk of stream) {
      console.log(chunk);
      socket.emit('suggested_answer', {
        contentIndex: data.contentIndex,
        contentChunk: chunk.content,
        isFinish: chunk.response_metadata?.finish_reason
      });
    }
  });
}
