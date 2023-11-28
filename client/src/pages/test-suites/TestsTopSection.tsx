import { CiSaveDown2 } from "react-icons/ci";
import { TbAdjustmentsCog } from "react-icons/tb";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { VscChecklist } from "react-icons/vsc";
import { Tooltip, TextField } from "@mui/material";

interface TestSuiteTopSectionProps {
  test: any;
  saveLoading: boolean;
  handleSaveAll: () => void;
  showConfig: boolean;
  setShowConfig: (showConfig: boolean) => void;
}
const TestsTopSection = ({
  test,
  saveLoading,
  handleSaveAll,
  showConfig,
  setShowConfig,
}: TestSuiteTopSectionProps) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <span className="text-white text-xl font-bold">{test?.name}</span>
      <div className="flex h-full space-x-4">
        {showConfig ? (
          !saveLoading ? (
            <Tooltip title="Save" arrow>
              <div>
                <CiSaveDown2
                  className="text-blue-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                  onClick={handleSaveAll}
                />
              </div>
            </Tooltip>
          ) : (
            <LoadingIcon />
          )
        ) : (
          <></>
        )}
        {showConfig ? (
          <Tooltip title="Tests" arrow>
            <div>
              <VscChecklist
                className="text-blue-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                onClick={() => setShowConfig(!showConfig)}
              />
            </div>
          </Tooltip>
        ) : (
          <Tooltip title="Config" arrow>
            <div>
              <TbAdjustmentsCog
                className="text-blue-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                onClick={() => setShowConfig(!showConfig)}
              />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default TestsTopSection;
