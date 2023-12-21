import * as React from "react";
import {
  AiOutlineDelete,
  AiOutlinePlayCircle,
  AiOutlinePlus,
} from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { TestType, useTestStore } from "../../stores/testStore";
import { AddTestModal } from "./AddTestModal";
import { LoadingIcon } from "../sniffers/LoadingIcon";

export const TestList = () => {
  const { testSuiteId } = useParams();
  const [testModalOpen, setTestModalOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { loadTests, tests, resetTests } = useTestStore();

  const fetchTestTree = () => {
    if (!testSuiteId) {
      resetTests();
      return;
    }
    setLoading(true);
    loadTests(testSuiteId).finally(() => {
      setLoading(false);
    });
  };

  React.useEffect(() => {
    fetchTestTree();
  }, [testSuiteId]);

  return (
    <>
      {tests.length === 0 && !loading && (
        <NoTests onClick={() => setTestModalOpen(true)} />
      )}
      <div className="flex flex-col">
        <div className="border-b border-border-color pb-2 mb-2">
          <div
            className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md`}
            onClick={() => setTestModalOpen(true)}
          >
            <div className="flex text-sm overflow-ellipsis whitespace-nowrap items-center p-2 gap-2">
              <AiOutlinePlus className="text-blue-500 text-xl h-[25px] w-[25px]" />
              <div>New Test</div>
            </div>
          </div>
        </div>
        {tests.map((test, _) => {
          return <TestItem test={test} />;
        })}
      </div>
      <AddTestModal
        open={testModalOpen}
        onClose={() => {
          setTestModalOpen(false);
        }}
      />
    </>
  );
};

interface NoTestsProps {
  onClick: () => void;
}

const NoTests = ({ onClick }: NoTestsProps) => {
  return (
    <div className="flex flex-col h-full justify-center items-center ">
      <div
        className="flex flex-row items-center space-x-2 px-2 hover:text-blue-400 cursor-pointer"
        onClick={onClick}
      >
        <p className=" text-lg">Add Test</p>

        <AiOutlinePlus className=" text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100" />
      </div>
    </div>
  );
};

const TestItem = ({ test }: { test: TestType }) => {
  const { testSuiteId, testId } = useParams();
  const { show, component: snackBar } = useSnackbar();
  const [isDeleteClicked, setIsDeleteClicked] = React.useState<boolean>(false);
  const navigator = useNavigate();

  const { executeTest, deleteTest, executedTests } = useTestStore();

  const onDeleteClicked = (testId: string) => {
    if (!testSuiteId || !testId) {
      return;
    }
    if (!isDeleteClicked) {
      setIsDeleteClicked(true);
      return;
    }

    deleteTest(testSuiteId as string, testId)
      .then(() => {
        show("Test deleted successfully", "success");
      })
      .catch(() => {
        show("Failed to delete test", "error");
      });
  };

  const execute = (testId: string) => {
    return executeTest(testSuiteId as string, testId)
      .then(() => {
        show("Test executed successfully", "success");
      })
      .catch(() => {
        show("Failed to execute test", "error");
      });
  };

  return (
    <div
      className={`flex flex-row w-full hover:bg-border-color cursor-pointer active:bg-tertiary items-center space-x-4 py-1 pl-4
    ${testId === test.id ? "bg-border-color" : ""}`}
      onClick={() => {
        navigator("/test-suites/" + testSuiteId + "/tests/" + test.id);
      }}
    >
      <div className="flex text-sm overflow-ellipsis whitespace-nowrap items-center w-full">
        {test.name}
      </div>
      <div className="flex flex-row items-center space-x-2 px-2">
        <AiOutlineDelete
          className={`text-[#fff] text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100 ${
            isDeleteClicked && "text-red-500"
          }`}
          onClick={(event: any) => {
            onDeleteClicked(test.id);
            event.stopPropagation();
          }}
        />
        {!executedTests[test.id] ? (
          <AiOutlinePlayCircle
            className="text-green-400 text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100"
            onClick={(event: any) => {
              execute(test.id);
              event.stopPropagation();
            }}
          />
        ) : (
          <LoadingIcon />
        )}
      </div>
      {snackBar}
    </div>
  );
};
