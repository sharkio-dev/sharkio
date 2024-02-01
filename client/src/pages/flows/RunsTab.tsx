import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import TabPanel from "@mui/lab/TabPanel";
import { MdChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useFlowStore } from "../../stores/flowStore";
import { useEffect } from "react";
import { LoadingIcon } from "../sniffers/LoadingIcon";

interface RunProps {
  createdAt: string;
  status: string;
  title: string;
}

const Run: React.FC<RunProps> = ({ createdAt, status, title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col border border-border-color p-2 px-4 shadow-md hover:border-blue-400 cursor-pointer rounded-md min-h-[48px] justify-center">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row justify-center items-center space-x-2">
          {status === "failed" ? (
            <AiOutlineCloseCircle className="text-red-400 text-2xl" />
          ) : (
            <AiOutlineCheckCircle className="text-green-400 text-2xl" />
          )}
          <div className="flex flex-col justify-center">
            <div className="flex flex-row items-center space-x-2">
              <div className="text-lg font-bold">{title}</div>
            </div>
            <div className="text-sm text-gray-400">
              {new Date(createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <MdChevronRight
            className=" active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
            onClick={() => {
              navigate("/flows/123/runs/123");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const RunsTab: React.FC = () => {
  const { runs, loadTestRuns, isRunsLoading } = useFlowStore();

  useEffect(() => {
    loadTestRuns();
  }, []);

  return (
    <TabPanel value="2" style={{ padding: 0, height: "100%" }}>
      <div className="flex flex-col space-y-2">
        {isRunsLoading ? (
          <LoadingIcon />
        ) : (
          runs.map((run, index) => {
            return (
              <Run
                key={index}
                createdAt={run.createdAt}
                status={run.status}
                title={`Run ${index + 1}`}
              />
            );
          })
        )}
      </div>
    </TabPanel>
  );
};
