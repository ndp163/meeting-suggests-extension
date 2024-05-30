import { RunnableSequence, RunnableWithMessageHistory } from '@langchain/core/runnables';
import LangchainServiceBase from './langchainBase.service';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { BaseMessageChunk } from '@langchain/core/messages';
import { ChatOpenAI } from "@langchain/openai";

export default class MeetingBotService extends LangchainServiceBase {
  // private chainWithMessageHistory!: RunnableWithMessageHistory<any, BaseMessageChunk>;
  private chain;

  constructor() {
    super();

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You will be provided with recorded meeting that is transcribed to text, maybe it transcribes some wrong, your task is to understand and summarize the meeting in English as follow format:
        ** Attendees **
        <Todo>
        
        ** Overall summary **
        <Todo>

        ** Issues **
        <Todo>
        
        ** Next actions **
        <Todo>`
      ],
      // new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);
    this.chain = prompt.pipe(this.llmModel);
    // const chatMessageHistory = new ChatMessageHistory();
    // this.chainWithMessageHistory = new RunnableWithMessageHistory({
    //   runnable: this.chain,
    //   getMessageHistory: (_sessionId) => chatMessageHistory,
    //   inputMessagesKey: "input",
    //   historyMessagesKey: "chat_history",
    // });
  }

  async summary(text: string) {
    const result = await this.chain.invoke(
      {
        input: text,
      }
    );

    return result.content;
  }
}
