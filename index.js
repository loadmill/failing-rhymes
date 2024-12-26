const core = require('@actions/core');
const github = require('@actions/github');
const aiAgent = require('./ai-agent');

const failFailed = (err = `It's sad, so sad. It's a sad, sad situation 🎶`) => {
    core.setFailed(err);
}

(async () => {
try {

    const openAIToken = core.getInput('openAIToken');
    const failureDescription = core.getInput('failureDescription');
    const user = core.getInput('user');

    const ghToken = core.getInput('ghToken');

    if (!openAIToken) {
        return `
          Without a token, you're out of luck,
          The gates to OpenAI are firmly stuck!`;
    }
    const rhyme = await aiAgent.createFailureRhyme(openAIToken, failureDescription, user);
    await postRhymeToGitHub(rhyme, ghToken);

    core.setOutput("rhyme", rhyme);

} catch (error) {
    failFailed(error.message);
}
})()
.then(() => {
    console.log(`Finished runnning Failure Rhyme Action`);
});

async function postRhymeToGitHub(rhyme, token) {
  try {
    const octokit = github.getOctokit(token);

    const { owner, repo } = github.context.repo;
    console.log(JSON.stringify(github.context, null, 2));
    const issue_number = github.context.payload.issue.number;

    const comment = await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number,
        body: rhyme,
    });

    return comment;
  } catch (e) {
    console.error("Error posting rhyme to GitHub:", e);
  }
}