import { NextApiRequest, NextApiResponse } from "next";
import { octokit } from "../../lib/octokit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dataStars =
    await octokit.activity.listReposStarredByAuthenticatedUser();

  const dataCommits = await octokit.search.commits({
    q: "committer-email:erik.albuquerque.oficial@gmail.com",
  });

  const dataPrs = await octokit.search.issuesAndPullRequests({
    q: "type:pr user:erik-albuquerque",
  });

  const dataIssues = await octokit.search.issuesAndPullRequests({
    q: "is:issue user:erik-albuquerque",
  });

  const starsCount = dataStars.data.length;

  const commitsCount = dataCommits.data.total_count;

  const prsCount = dataPrs.data.total_count;

  const issuesCount = dataIssues.data.total_count;
  
    res.status(200).send(
      `
        #### Stats
        - ⭐ Stars: ${starsCount}    
        - :sparkles: Commits (2022): ${commitsCount}    
        - 🧵 PRs: ${prsCount}    
        - 🚩 Issues: ${issuesCount}    
      `
    )
}