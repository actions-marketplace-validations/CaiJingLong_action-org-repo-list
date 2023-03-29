import * as core from '@actions/core'
import {env} from 'process'
import {getClient} from './repo'

async function run(): Promise<void> {
  try {
    const org = env.GITHUB_ORG
    if (!org) {
      throw new Error('GITHUB_ORG env is not set')
    }
    const github = getClient()

    const allRepo = await github.paginate(github.repos.listForOrg, {
      org
    })

    let repoInfo = allRepo.map(repo => {
      return {
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        latestCommit: repo.updated_at,
        archived: (repo.archived = repo.archived ?? false)
      }
    })

    // sort by latest commit
    repoInfo = repoInfo
      .sort((a, b) => {
        return (a.latestCommit ?? '')?.localeCompare(b.latestCommit ?? '')
      })
      .filter(repo => !repo.archived)

    // make a markdown table
    let table = `| Name | Description | Latest Commit |\n| ---- | ----------- | ------------- |\n`
    for (const repo of repoInfo) {
      table += `| [${repo.name}](${repo.url}) | ${repo.description} | ${repo.latestCommit} |\n`
    }

    core.info(table)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
