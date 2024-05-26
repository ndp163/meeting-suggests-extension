import { RunnableSequence, RunnableWithMessageHistory } from '@langchain/core/runnables';
import LangchainServiceBase from './langchainBase.service';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { BaseMessageChunk } from '@langchain/core/messages';
import { ChatOpenAI } from "@langchain/openai";

export default class MeetingBotService extends LangchainServiceBase {
  private chainWithMessageHistory!: RunnableWithMessageHistory<any, BaseMessageChunk>;

  constructor() {
    super();

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You will be provided with recorded meeting that is transcribed to text, and your task is to summarize the meeting as follows:
        - Overall summary of discussion.
        - List the main points of discussion.`
      ],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);
    const chain = prompt.pipe(this.llmModel);
    const chatMessageHistory = new ChatMessageHistory();
    this.chainWithMessageHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: (_sessionId) => chatMessageHistory,
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
    });
  }

  async summary(text: string) {
    // const result = await this.chainWithMessageHistory.invoke(
    //   {
    //     input: text,
    //   },
    //   { configurable: { sessionId: "1" } }
    // );
    console.log(await this.chainWithMessageHistory.getMessageHistory("1"));

    return "Oke";
  }
}
