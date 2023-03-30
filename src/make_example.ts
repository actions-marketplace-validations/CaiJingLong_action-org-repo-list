import {env, exit} from 'process'
import makeTable from './make'
import * as core from '@actions/core'
import fs from 'fs'

async function run(): Promise<void> {
  const githubToken = env.GITHUB_TOKEN
  const org = 'fluttercandies'
  const containsArchived = false
  const excludeRepoNames = ['.github']

  if (!githubToken) {
    core.setFailed('github-token is required')
    exit(1)
  }

  const table = await makeTable(
    org,
    githubToken,
    containsArchived,
    excludeRepoNames,
    true
  )

  fs.writeFileSync('example.md', table)
}

run()
