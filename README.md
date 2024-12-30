# Failing Rhymes action

This action meant to be triggered when your workflow has failed. It ask for a rhyme from OpenAI and post it to the pull request that triggered the workflow.

## Inputs

### `openAIToken`

**Required** A token to use OpenAI API. You can get one by signing up to OpenAI and creating an API key.

### `ghToken`

**Required** A token to use GitHub API. You can get one by creating a personal access token in your GitHub account.

### `failureDescription`

**Required** A description of the failure. Recommended to include the commit that triggered the workflow or any other data you can find in the payload of the action.
For example: `"Commit ${{ github.ref }} by ${{ github.actor }}"`

### `user`

**Required** The user who made the commit that triggered the workflow. For example: `'${{ github.event.workflow_run.actor.name }}'`

## Outputs

### `rhyme`

The resulted rhyme. Also posted to the pull request that triggered the workflow.

## Example usage

Assuming you have a workflow named myWorkflow (notice the name property in the yml file) that runs all your action, create a nother workflow (postFlow) that runs only when my-workflow fails.
Like this:

### Your main workflow
```yaml
name: myWorkflow
on: [pull_request, workflow_dispatch]

jobs:
  test_the_action:
    runs-on: ubuntu-latest
    name: A job to rhyme
    steps:
      - name: This step will fail
        run: |
          echo "About to fail..."
          exit 1
```

### The new work flow that will run only when myWorkflow fails
```yaml
on:
  workflow_run:
    workflows: [myWorkflow]
    types: [completed]

jobs:
  on-failure:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    steps:
      - name: Rhyme the failure
        uses: loadmill/failing-rhymes@v1
        id: failingRhymes
        with:
          openAIToken: ${{ secrets.OPENAI_API_TOKEN }}
          ghToken: ${{ secrets.GH_API_TOKEN }}
          failureDescription: "Commit ${{ github.ref }} by ${{ github.actor }}"
          user: '${{ github.event.workflow_run.actor.name }}'
      # Use the output from the `test_our_action_step` step
      - name: Get the output rhyme
        run: echo "The rhyme was ${{ steps.failingRhymes.outputs.rhyme }}"
```
