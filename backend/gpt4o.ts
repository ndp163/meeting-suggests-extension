import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      { 
        role: "system", content: "You are a helpful assistant.",
      },
      {
        role: "user", content: ""
      }
    ],
    model: "gpt-4o",
    max_tokens: 200
  });

  console.log(completion.choices[0]);
}

main();