import {Octokit} from '@octokit/rest'

export function getClient(token: string): Octokit {
  const octokit = new Octokit({auth: token})
  return octokit
}
