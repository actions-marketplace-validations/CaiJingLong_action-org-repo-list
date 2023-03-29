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
      let desc = repo.description ?? '<no description>'
      if (desc.includes('|')) {
        desc = desc.replace(/\|/g, '\\|')
      }
      return {
        name: repo.name,
        stars: repo.stargazers_count ?? 0,
        url: repo.html_url,
        description: desc,
        latestCommit: repo.updated_at,
        archived: (repo.archived = repo.archived ?? false)
      }
    })

    // sort by stars
    repoInfo = repoInfo
      .sort((a, b) => {
        return b.stars - a.stars
      })
      .filter(repo => !repo.archived)

    // make a markdown table
    let table = `| Name | Description | Stars | Latest Commit |\n| ---- | --- | ----------- | ------------- |\n`
    for (const repo of repoInfo) {
      table += `| [${repo.name}](${repo.url}) | ${repo.description} | ${repo.stars} | ${repo.latestCommit} |\n`
    }

    core.info(table)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
