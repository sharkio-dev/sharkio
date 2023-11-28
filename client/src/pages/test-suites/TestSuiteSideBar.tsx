import React from "react";
import { AiOutlinePlayCircle, AiOutlinePlus } from "react-icons/ai";
import { TestTree } from "./TestTree";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { useTestSuiteStore } from "../../stores/testSuitesStore";
import { useNavigate, useParams } from "react-router-dom";
import { Sniffer } from "../sniffers/SniffersSideBar";
import { LuTestTube2 } from "react-icons/lu";
import {
  AddTestSuiteModal,
  EditTestSuiteModal,
  DeleteTestSuiteModal,
} from "./AddTestSuiteModal";
import { VscChecklist } from "react-icons/vsc";
import { useTestStore } from "../../stores/testStore";
import { LoadingIcon } from "../sniffers/loadingIcon";

export const TestSuiteSideBar = () => {
  const [addTestSuiteModalOpen, setAddTestSuiteModalOpen] =
    React.useState<boolean>(false);
  const [editTestSuiteModalOpen, setEditTestSuiteModalOpen] =
    React.useState<boolean>(false);
  const [deleteTestSuiteModalOpen, setDeleteTestSuiteModalOpen] =
    React.useState<boolean>(false);
  const { loadTestSuites, testSuites } = useTestSuiteStore();
  const navigator = useNavigate();
  const [selectValue, setSelectValue] = React.useState<string>("");
  const selectedTestSuite = testSuites.find(
    (testSuite) => testSuite.id === selectValue,
  );
  const { testSuiteId } = useParams();
  const { tests, executeTest } = useTestStore();
  const [loading, setLoading] = React.useState<boolean>(false);

  const loadTS = () => {
    loadTestSuites().then(() => {
      if (testSuiteId) {
        setSelectValue(testSuiteId);
      }
    });
  };

  const executeAllTests = () => {
    if (!testSuiteId) {
      return;
    }
    const combinedArray = Object.values(tests).reduce(
      (acc, array) => [...acc, ...array],
      [],
    );
    setLoading(true);
    return Promise.all(
      combinedArray.map((test) => executeTest(testSuiteId, test.id)),
    )
      .then(() => {
        navigator("/test-suites/" + testSuiteId);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    loadTS();
  }, []);

  React.useEffect(() => {
    if (testSuiteId) {
      setSelectValue(testSuiteId);
    } else {
      setSelectValue("");
    }
  }, [testSuiteId]);

  return (
    <>
      <div className="flex flex-row items-center space-x-2 px-2">
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel>Test Suites</InputLabel>
          <Select value={selectValue} label="Test Suites">
            <MenuItem
              onClick={() => setAddTestSuiteModalOpen(true)}
              value={"addTestSuite"}
            >
              <Sniffer
                LeftIcon={AiOutlinePlus}
                isSelected={false}
                name={"Add Test Suite"}
              />
            </MenuItem>
            {testSuites.map((testSuite, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  setSelectValue(testSuite.id);
                  navigator("/test-suites/" + testSuite.id);
                }}
                value={testSuite.id}
              >
                <Sniffer
                  LeftIcon={LuTestTube2}
                  onEditSniffer={() => {
                    setSelectValue(testSuite.id);
                    setEditTestSuiteModalOpen(true);
                  }}
                  onDeleteSniffer={() => {
                    navigator("/test-suites/");
                    setDeleteTestSuiteModalOpen(true);
                  }}
                  name={testSuite.name}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Show test suite details">
          <VscChecklist
            className="flex text-xl cursor-pointer hover:scale-105 active:scale-100 transition-transform"
            onClick={() => {
              navigator("/test-suites/" + selectValue);
            }}
          />
        </Tooltip>
        <Tooltip title="Execute all tests in this test suite">
          {loading ? (
            <LoadingIcon />
          ) : (
            <AiOutlinePlayCircle
              className="flex text-xl text-green-400 cursor-pointer hover:scale-105 active:scale-100 transition-transform"
              onClick={executeAllTests}
            />
          )}
        </Tooltip>
      </div>
      <div className="flex flex-col space-y-2 mt-4 h-full">
        {!testSuiteId && (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <p className="text-gray-500 text-center">Select a test suite</p>
          </div>
        )}
        {testSuiteId && <TestTree />}
      </div>
      <AddTestSuiteModal
        open={addTestSuiteModalOpen}
        onClose={() => {
          setAddTestSuiteModalOpen(false);
        }}
      />
      <EditTestSuiteModal
        open={editTestSuiteModalOpen}
        onClose={() => {
          setEditTestSuiteModalOpen(false);
        }}
        name={selectedTestSuite?.name ?? ""}
      />
      {selectedTestSuite && (
        <DeleteTestSuiteModal
          isOpen={deleteTestSuiteModalOpen}
          onClose={() => {
            setDeleteTestSuiteModalOpen(false);
          }}
          testSuite={selectedTestSuite}
        />
      )}
    </>
  );
};
