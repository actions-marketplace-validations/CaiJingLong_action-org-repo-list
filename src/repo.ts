import {Octokit} from '@octokit/rest'

export function getClient(): Octokit {
  const token = process.env.GITHUB_TOKEN
  const octokit = new Octokit({auth: token})
  return octokit
}
