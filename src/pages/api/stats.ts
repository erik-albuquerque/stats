import { NextApiRequest, NextApiResponse } from "next";
import { octokit } from "../../lib/octokit";
import { Base64 } from "js-base64";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  const statsWith = `
  ### Hi there 👋

  I'm Érik.  
  I like technology, animals, games, series, love music and a cup of coffee can not miss.

  - 📚 I’m currently studyng!
  - 🌱 I’m currently learning about NextJs, TypeScript, React Native, Git/Github, Figma.

  #### skills
  - React, Nextjs, JavaScript, TypeScript, APIRest, HTML, CSS/SASS, Figma, Git, Linux.

  #### Stats
  - ⭐ Stars: ${starsCount}    
  - :sparkles: Commits (2022): ${commitsCount}    
  - 🧵 PRs: ${prsCount}    
  - 🚩 Issues: ${issuesCount}    

  you can find me here:  

  [![Linkedin Badge](https://img.shields.io/badge/-Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/erik-albuquerque/)](https://www.linkedin.com/in/erik-albuquerque/)
  [![Gmail Badge](https://img.shields.io/badge/-Gmail-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:erik.albuquerque.oficial@gmail.com)](mailto:erik.albuquerque.oficial@gmail.com)
  [Portfolio](https://portfolio-kataik.vercel.app/)
  `;

  const getSha = async () => {
    const {
      data: { sha },
    } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{file_path}",
      {
        owner: "erik-albuquerque",
        repo: "erik-albuquerque",
        file_path: "README.md",
      }
    );

    return sha
  };

  const getStats = async () => {
    try {
      const contentEncoded = Base64.encode(statsWith);

      const sha = await getSha()

      const data = await octokit.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          sha,
          owner: "erik-albuquerque",
          repo: "erik-albuquerque",
          path: "README.md",
          message: `docs(README): update README.md programatically. date: ${new Date().toISOString()}`,
          content: contentEncoded,
          committer: {
            name: `Érik Albuquerque`,
            email: "erik.albuquerque.oficial@gmail.com",
          },
        }
      );

      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  await getStats();

  res.status(200).send(
    `
        #### Stats
        - ⭐ Stars: ${starsCount}    
        - :sparkles: Commits (2022): ${commitsCount}    
        - 🧵 PRs: ${prsCount}    
        - 🚩 Issues: ${issuesCount}    
      `
  );
}
