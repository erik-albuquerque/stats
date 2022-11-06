import { Octokit } from "@octokit/rest";

const options = { auth: process.env.GITHUB_ACCESS_TOKEN };

const octokit = new Octokit(options);

export { octokit };
