const aiAgent = require('./ai-agent');

(async () => {
  console.log(`Running TEST Failure Rhyme Action`);
try {

    const openAIToken = process.env.OPENAI_TOKEN;
    const failureDescription = 'this is a test failure description';
    const user = 'test-user';

    const rhyme = await aiAgent.createFailureRhyme(openAIToken, failureDescription, user);
    console.log(rhyme);

} catch (error) {
    console.error(error);
}
})()
.then(() => {
  console.log(`Finished runnning Failure Rhyme Action`);
});
