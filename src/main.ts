import * as core from '@actions/core'
import {env} from 'process'
import makeTable from './make'

async function run(): Promise<void> {
  try {
    const org = core.getInput('org')
    const githubToken = core.getInput('github-token')

    if (!org) {
      throw new Error('org is required')
    }

    if (!githubToken) {
      throw new Error('github-token is required')
    }

    env.GH_TOKEN = githubToken

    const containsArchivedInput = core.getInput('contains-archived') || 'false'
    const containsArchived = containsArchivedInput === 'true'
    const excludeRepoNamesInput =
      core.getInput('exclude-repo-names') || '.github,.github-workflow'
    const excludeRepoNames = excludeRepoNamesInput.split(',')

    const output = await makeTable(
      org,
      githubToken,
      containsArchived,
      excludeRepoNames
    )

    core.setOutput('table', output)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
