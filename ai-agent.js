import {
  Configuration,
  OpenAIApi,
} from 'openai';

async function createFailureRhyme(apiKey, failureDescription, user) {
  try {
    const openai = new OpenAIApi(new Configuration({
      apiKey,
    }));

    const response = await openai.createChatCompletion(getChatCompletionRequest(failureDescription, user));
    const rhyme = response.data.choices?.[0]?.message?.content

    return rhyme;
  } catch (error) {
    console.error("Error creating rhyme:", error);
    return "Sorry, I couldn't create a rhyme.";
  }
}

const getChatCompletionRequest = (failureDescription, user) => {
  
  const prompt = `
    You are a witted engineer and you need to create a rhyme about a failure that happened when running a GitHub Action on the current commit.
    It has to be short and witted - no more then 4 lines. Dont insolt the engineer that caused it. Be funny.
    The failtre is - ${failureDescription} and the user who casued it is - ${user}.`;

  return {
    model : "gpt-4o",
    messages,
    max_tokens: 100,
    n: 1,
    stream: false,
  };
};

module.exports = { createFailureRhyme };