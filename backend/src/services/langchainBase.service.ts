import { ChatOpenAI } from "@langchain/openai";
import 'dotenv/config';

export default abstract class LangchainServiceBase {
  protected llmModel!: ChatOpenAI

  constructor() {
    this.llmModel = new ChatOpenAI({
      model: 'gpt-4o',
      apiKey: process.env.OPENAI_KEY,
      temperature: 0.5
    })
  }
}