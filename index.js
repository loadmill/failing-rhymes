const core = require('@actions/core');
const github = require('@actions/github');
const aiAgent = require('./aiAgent');

const failFailed = (err = `It's sad, so sad. It's a sad, sad situation 🎶`) => {
    core.setFailed(err);
}

(async () => {
try {

    const openAIToken = core.getInput('openAIToken');
    const failureDescription = core.getInput('failureDescription');
    const user = core.getInput('user');

    const ghToken = core.getInput('ghToken');
    const rhyme = await aiAgent.createFailureRhyme(openAIToken, failureDescription, user);
    await postRhymeToGitHub(rhyme, ghToken);

} catch (error) {
    failFailed(error.message);
}
})()
.then(() => {
    console.log(`Finished runnning Loadmill Test Plan`);
});

async function postRhymeToGitHub(rhyme, token) {
    const octokit = github.getOctokit(token);

    const { owner, repo } = github.context.repo;
    const issue_number = github.context.payload.issue.number;

    const comment = await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number,
        body: rhyme,
    });

    return comment;
}