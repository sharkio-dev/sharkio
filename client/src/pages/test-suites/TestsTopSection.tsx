import { CiSaveDown2 } from "react-icons/ci";
import { TbAdjustmentsCog } from "react-icons/tb";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { VscChecklist } from "react-icons/vsc";
import { useTestStore } from "../../stores/testStore";
import { AiOutlineUpload } from "react-icons/ai";
import OutlinedButton from "../../utils/OutlinedButton";
interface TestSuiteTopSectionProps {
  saveLoading: boolean;
  handleSaveAll: () => void;
  showConfig: boolean;
  setShowConfig: (showConfig: boolean) => void;
}
const TestsTopSection = ({
  saveLoading,
  handleSaveAll,
  showConfig,
  setShowConfig,
}: TestSuiteTopSectionProps) => {
  const currentTest = useTestStore((state) => state.currentTest);

  return (
    <div className="flex flex-row items-center justify-between">
      <span className="text-white text-x1  font-bold">{currentTest?.name}</span>
      <div className="flex h-full  space-x-4">
        {showConfig ? (
          !saveLoading ? (
            <OutlinedButton
              onClick={handleSaveAll}
              startIcon={
                <div className="w-4 h-5">
                  <CiSaveDown2 />
                </div>
              }
              value="save"
            />
          ) : (
            <OutlinedButton
              size="small"
              startIcon={<AiOutlineUpload />}
              value={<LoadingIcon />}
            />
          )
        ) : (
          <></>
        )}
        {showConfig ? (
          <OutlinedButton
            onClick={() => setShowConfig(!showConfig)}
            startIcon={<VscChecklist />}
            value="tests"
          />
        ) : (
          <OutlinedButton
            onClick={() => setShowConfig(!showConfig)}
            startIcon={<TbAdjustmentsCog />}
          />
        )}
      </div>
    </div>
  );
};

export default TestsTopSection;
