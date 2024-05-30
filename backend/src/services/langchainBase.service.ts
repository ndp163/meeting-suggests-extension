import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
import {
  AzureAISearchVectorStore,
} from "@langchain/community/vectorstores/azure_aisearch";

import { ChatOpenAI } from "@langchain/openai";
import 'dotenv/config';

export default abstract class LangchainServiceBase {
  // protected vectorStore!: AzureAISearchVectorStore
  protected llmModel!: ChatOpenAI

  constructor() {
    // this.llmModel = new BedrockChat({
    //   model: "anthropic.claude-3-haiku-20240307-v1:0",
    //   region: process.env.AWS_REGION,
    //   credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    //   },
    //   maxTokens: 200,
    //   temperature: 0.7,
    //   // modelKwargs: {},
    // });

    this.llmModel = new ChatOpenAI({
      model: 'gpt-4o',
      apiKey: process.env.OPENAI_KEY,
      temperature: 0.5
    })

    // const embeddingModel = new BedrockEmbeddings({
    //   region: process.env.AWS_REGION,
    //   credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    //   },
    //   model: "amazon.titan-embed-text-v1", // Default value
    // });

    // this.vectorStore = new AzureAISearchVectorStore(embeddingModel, {});
  }
}