import { Bedrock } from "@langchain/community/llms/bedrock";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
import { Document } from "langchain/document";
import { index } from "langchain/indexes";
import {
  AzureAISearchVectorStore,
  AzureAISearchQueryType,
} from "@langchain/community/vectorstores/azure_aisearch";
import { RecordManager } from "@langchain/community/indexes/base";
import { RunnableSequence } from '@langchain/core/runnables';

require('dotenv').config();

class LangchainService {
  private template: string
  // #ragChain: RunnableSequence
  private static vectorStore: AzureAISearchVectorStore
  private static llmModel: Bedrock
  // #retriever

  constructor() {
    this.template = `Human: You are an AI assistant searching for companies that match user demands. Using information from the context, generate a response that return the list name of companies relevant for the user's demands below:
      Demands: {question}
      Context: {context}

    Assistant:
    `;
  }

  async init() {
    if (!LangchainService.vectorStore) {
      LangchainService.llmModel = new Bedrock({
        model: "anthropic.claude-v2:1",
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        maxTokens: 200,
        temperature: 0.7,
        // modelKwargs: {},
      });
  
      const embeddingModel = new BedrockEmbeddings({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        model: "amazon.titan-embed-text-v1", // Default value
      });
  
      LangchainService.vectorStore = new AzureAISearchVectorStore(embeddingModel, {});
    }
    // const customRagPrompt = PromptTemplate.fromTemplate(this.template);

    // this.#ragChain = await createStuffDocumentsChain({
    //   llm: llmModel,
    //   prompt: customRagPrompt,
    //   outputParser: new StringOutputParser(),
    // });

    // const loader = new TextLoader(__dirname + "/references.txt");
    // const rawDocuments = await loader.load();


    // const vectorStore = await AzureAISearchVectorStore(this.#embedding, {
    //   search: {
    //     type: AzureAISearchQueryType.Similarity
    //   }
    // });


    // vectorStore.similaritySearchWithScore("companies provide law lawyer", 4)
    
    // await store.delete({
    //   filter: {
    //     filterExpression: "metadata/source eq '1' or metadata/source eq '2'"
    //   }
    // });

    // this.#retriever = store.asRetriever({
    //   searchType: 'mmr',
    //   searchKwargs: {
    //     lambda: 0.9
    //   }
    // });
  }

  async addDocuments() {
    const doc1 = new Document({ 
      pageContent: "Pantheon Law has provided a full range of services to domestic and international clients who conduct investing and business in Vietnam. Specially, Pantheon’s lawyers regularly advise clients globally on corporate governance, mergers and acquisitions (M&A), restructuring, real estate, housing, etc. in Vietnam.", 
      metadata: { source: "1", attributes: [{
        key: "name",
        value: "P.A.T"
      }]} 
    });

    const doc2 = new Document({ 
      pageContent: `Minimum Viable Product (MVP) development refers to the method of developing a product with the minimum necessary functions at low cost and in a short period when launching a new business, in order to verify customer needs at an early stage.
      Adapting to the dynamic market environment, MVP development begins with the release of an MVP version, and continuously releases the product through its maintenance and improvement. This allows you to observe the target market's response, analyze customer needs and preferences, find out the best direction for your business, and maximize the value.`, 
      metadata: { source: "2", attributes: [{
        key: "name",
        value: "VFA"
      }]}
    });


    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      chunkOverlap: 10,
    });

    const documents = await splitter.splitDocuments([doc1, doc2]);
    LangchainService.vectorStore.addDocuments(documents);
  }

  async getMatching() {
    // const context = await this.#retriever.getRelevantDocuments(
    //   "companies provide law lawyer",
    //   {}
    // );
    const context =  await LangchainService.vectorStore.similaritySearchWithScore("companies provide law lawyer");
    console.log(context);
    for (let doc of context) {
      console.log(doc[0].metadata);
    }
    return context;

    // return await this.#ragChain.invoke({
    //   question: "Find companies provide law service",
    //   context,
    // });
  }
}

export default LangchainService;