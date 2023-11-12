import * as React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { TestTree } from "./TestTree";
import { SelectComponent } from "./SelectComponent";
import {
  Button,
  CircularProgress,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import { useTestSuiteStore } from "../../stores/testSuitesStore";
import { useSnackbar } from "../../hooks/useSnackbar";

export const TestSuiteSideBar = () => {
  const [addTestSuiteModalOpen, setAddTestSuiteModalOpen] =
    React.useState<boolean>(false);

  const { loadTestSuites, testSuites } = useTestSuiteStore();
  const [selectedTestSuite, setSelectedTestSuite] = React.useState<string>("");

  React.useEffect(() => {
    loadTestSuites();
  }, []);

  return (
    <>
      <div className="flex flex-row items-center space-x-2 px-2">
        <SelectComponent
          options={testSuites.map((testSuite) => ({
            value: testSuite.id,
            label: testSuite.name,
          }))}
          title="Test Suite"
          value={selectedTestSuite}
          setValue={(value: string) => setSelectedTestSuite(value)}
        />
        <AiOutlinePlus
          className="text-[#fff] text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
          onClick={() => setAddTestSuiteModalOpen(true)}
        />
      </div>
      <div className="flex flex-col space-y-2 mt-4">
        <TestTree />
      </div>
      <AddTestSuiteModal
        open={addTestSuiteModalOpen}
        onClose={() => setAddTestSuiteModalOpen(false)}
      />
    </>
  );
};

type AddTestSuiteModalProps = {
  open: boolean;
  onClose: () => void;
};

const AddTestSuiteModal = ({ open, onClose }: AddTestSuiteModalProps) => {
  const [name, setName] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [type, setType] = React.useState<string>("Test Suite");
  const { createTestSuite } = useTestSuiteStore();
  const { show, component: snackBar } = useSnackbar();
  const [loadingCreateTestSuite, setLoadingCreateTestSuite] =
    React.useState<boolean>(false);

  const onClickAdd = () => {
    if (name === "" && type === "Test Suite") {
      show("Name cannot be empty", "error");
      return;
    }
    setIsLoading(true);
    if (type === "Test Suite") {
      setLoadingCreateTestSuite(true);
      createTestSuite(name)
        .then(() => {
          show("Test Suite created successfully", "success");
          resetState();
          onClose();
        })
        .catch(() => {
          show("Test Suite creation failed", "error");
        })
        .finally(() => {
          setLoadingCreateTestSuite(false);
        });
    } else {
      // addTestEndpoint();
    }
  };

  const resetState = () => {
    setName("");
    setIsLoading(false);
    setType("Test Suite");
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        resetState();
      }}
      className="flex justify-center items-center border-0"
    >
      <Paper className="flex flex-col p-4 w-96 rounded-sm border-0">
        {snackBar}

        <div className="text-2xl font-bold">Add {type}</div>
        <div className="w-full border-b-[0.05px] my-4" />
        <div className="flex flex-col space-y-4">
          <SelectComponent
            options={[
              { value: "Test Suite", label: "Test Suite" },
              { value: "Test Endpoint", label: "Test Endpoint" },
            ]}
            title="Type"
            value={type}
            setValue={(value: string) => setType(value)}
          />
          {type === "Test Suite" && (
            <TextField
              label={`${type} Name`}
              placeholder={`${type} Name`}
              size="small"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          )}
          {type === "Test Endpoint" && (
            <>
              <SelectComponent
                options={[
                  { value: "1", label: "Sniffer 1" },
                  { value: "2", label: "Sniffer 2" },
                ]}
                title="Sniffers"
                value="1"
                setValue={(value: string) => {}}
              />
              <SelectComponent
                options={[
                  { value: "1", label: "Endpoint 1" },
                  { value: "2", label: "Endpoint 2" },
                ]}
                title="Endpoint"
                value="1"
                setValue={(value: string) => {}}
              />
            </>
          )}
        </div>

        <div className="flex flex-row justify-end mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={onClickAdd}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};
