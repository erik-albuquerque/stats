/* eslint-disable react-hooks/exhaustive-deps */
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { octokit } from "../lib/octokit";

type HomeProps = {
  starsCount: number;
  commitsCount: number;
  prsCount: number;
  issuesCount: number;
};

export default function Home(props: HomeProps) {
  const setInfos = async () => {
    try {
      fetch("https://stats-kataik.vercel.app/api/stats")
    } catch (error) {
      console.log("error", error)
      throw error
    }
  }

  let setInfosInterval: NodeJS.Timeout

  const TWO_DAYS_IN_SECONDS = 172800 // 2 days 

  useEffect(() => {
    setInfosInterval = setInterval(async () => {
      await setInfos()
    }, TWO_DAYS_IN_SECONDS)


    return () => clearInterval(setInfosInterval)
  }, [])

  return (
    <>
      {`
        #### Stats
        - ⭐ Stars: ${props.starsCount}    
        - :sparkles: Commits (2022): ${props.commitsCount}    
        - 🧵 PRs: ${props.prsCount}    
        - 🚩 Issues: ${props.issuesCount}    
      `}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
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

  return {
    props: {
      starsCount,
      commitsCount,
      prsCount,
      issuesCount,
    },
  };
};
