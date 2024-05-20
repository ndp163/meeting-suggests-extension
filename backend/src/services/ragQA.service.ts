import { RunnableSequence } from '@langchain/core/runnables';
import LangchainServiceBase from './langchainBase.service';
import { PromptTemplate } from '@langchain/core/prompts';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export default class RagQAService extends LangchainServiceBase {
  private ragChain!: RunnableSequence
  private prompt!: PromptTemplate

  constructor() {
    super();

    const promptTemplate = `Human: You are an AI assistant searching for companies that match user demands. Using information from the context, generate a response that return the list name of companies relevant for the user's demands below:
      Demands: {question}
      Context: {context}
      Assistant:
    `;
    this.prompt = PromptTemplate.fromTemplate(promptTemplate);
  }

  async init() {
    if (!this.ragChain) {
      await super.init();

      this.ragChain = await createStuffDocumentsChain({
        llm: this.llmModel,
        prompt: this.prompt,
        outputParser: new StringOutputParser(),
      });
    }
  }

  async loadDocuments() {
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
    this.vectorStore.addDocuments(documents);
    // await store.delete({
    //   filter: {
    //     filterExpression: "metadata/source eq '1' or metadata/source eq '2'"
    //   }
    // });
  }

  async ask(text: string) {
    // const context = await this.#retriever.getRelevantDocuments(
    //   "companies provide law lawyer",
    //   {}
    // );
    const context =  await this.vectorStore.similaritySearchWithScore("companies provide law lawyer");
    console.log(context);
    for (let doc of context) {
      console.log(doc[0].metadata);
    }
    return context;

    // return await this.ragChain.invoke({
    //   question: "Find companies provide law service",
    //   context,
    // });
  }
}