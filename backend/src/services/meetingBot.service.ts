import { RunnableSequence, RunnableWithMessageHistory } from '@langchain/core/runnables';
import LangchainServiceBase from './langchainBase.service';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { BaseMessageChunk } from '@langchain/core/messages';

export default class MeetingBotService extends LangchainServiceBase {
  private chainWithMessageHistory!: RunnableWithMessageHistory<any, BaseMessageChunk>;

  constructor() {
    super();

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Bạn là một con bot hỗ trợ tôi trong 1 cuộc phỏng vấn lập trình web. Khi người phỏng vấn hỏi, hãy đề xuất tôi cách trả lời bằng tiếng Anh, và giải thích bằng tiếng Việt cho tôi hiểu",
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "Người phỏng vấn hỏi câu hỏi sau: {input}"],
    ]);
    console.log(prompt);
    const chain = prompt.pipe(this.llmModel);
    const chatMessageHistory = new ChatMessageHistory();
    this.chainWithMessageHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: (_sessionId) => chatMessageHistory,
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
    });
    // const template = `Human: You are an AI translating assistant. Translate the following text from English to Vietnamese:
    //   "{question}"
    //   Assistant:
    // `
  }

  async suggest(text: string) {
    const result = await this.chainWithMessageHistory.invoke(
      {
        input: text,
      },
      { configurable: { sessionId: "1" } }
    );

    return result.content;
  }
}
