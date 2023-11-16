import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import LoginComponent from "../login-component/login-component";
import axios from "axios";
import { Logo } from "../sidebar/Logo";
import { BsGithub } from "react-icons/bs";
import ProjectSelector from "../project-selection/ProjectSelector";

export const Navbar: React.FC = () => {
  const { user } = useAuthStore();

  const isLoggedOut = user == null || user.email == null;

  return (
    <div className="flex w-full h-14 bg-primary border-b border-border-color px-4 py-2 justify-between">
      {!isLoggedOut && <ProjectSelector />}

      <div className="items-center flex space-x-2">
        {isLoggedOut && (
          <>
            <Logo />
            <div className="text-white text-lg font-bold font-mono">
              <div>Sharkio</div>
            </div>
          </>
        )}
      </div>

      <div className="items-center flex">
        {!isLoggedOut && <LoginComponent />}
        {isLoggedOut && <GithubStarButton />}
      </div>
    </div>
  );
};

const GithubStarButton = () => {
  const [_, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    const repoUrl = "https://api.github.com/repos/sharkio-dev/sharkio";
    axios
      .get(repoUrl)
      .then((response) => {
        const data = response.data;
        const stargazersCount = data.stargazers_count;
        setStarCount(stargazersCount);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);

  return (
    <a
      href="https://github.com/sharkio-dev/sharkio"
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full"
    >
      <div className="flex flex-row items-center space-x-2 h-full rounded-lg">
        <BsGithub className="text-2xl mr-1" />
      </div>
    </a>
  );
};
