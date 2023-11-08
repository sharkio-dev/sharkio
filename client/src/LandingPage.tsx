import { useNavigate } from "react-router-dom";
import { routes } from "./constants/routes";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-1 items-center justify-center"
      style={{
        background: `linear-gradient(to right, #181818, #2d2d2d, #181818)`,
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-white text-4xl font-bold font-mono">
          <div>Sharkio</div>
          <div className="text-2xl font-normal">API Development Made Easy.</div>
        </div>
        <div className="flex flex-row mt-4 w-full justify-between">
          <div
            className="flex border-blue-200 border-2 rounded-lg p-2 items-center w-40 justify-center hover:scale-105 hover:cursor-pointer active:scale-95 text-white text-lg font-bold font-mono"
            onClick={() => navigate(routes.DOCS_GETTING_STARTED)}
          >
            Get Started
          </div>

          <div
            className="flex bg-blue-200 rounded-lg p-2 shadow-sm items-center w-40 justify-center hover:scale-105 hover:cursor-pointer active:scale-95 text-border-color text-lg font-bold font-mono"
            onClick={() => navigate(routes.LOGIN)}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
};
