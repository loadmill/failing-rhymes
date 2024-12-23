const OpenAI = require('openai');

async function createFailureRhyme(apiKey, failureDescription, user) {
  try {
    const openai = new OpenAI({
      apiKey
    });

    const response = await openai.chat.completions.create(getChatCompletionRequest(failureDescription, user));
    const rhyme = response.choices?.[0]?.message?.content

    return rhyme;
  } catch (error) {
    console.error("Error creating rhyme:", error);
    return "Sorry, I couldn't create a rhyme.";
  }
}

const getChatCompletionRequest = (failureDescription, user) => {
  return {
    model : "gpt-4o",
    messages: [{
      role: "system",
      content: "You are a witty engineer who creates short, funny rhymes about GitHub Action failures."
    }, {
      role: "user",
      content: `Create a witty rhyme (max 4 lines) about this GitHub Action failure. Be funny but don't insult the engineer.
               Failure: ${failureDescription}
               User: ${user}`
    }],
    max_tokens: 100,
    n: 1,
    stream: false,
  };
};

module.exports = { createFailureRhyme };