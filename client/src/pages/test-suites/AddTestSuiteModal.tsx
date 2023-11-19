import React, { useCallback, useState } from "react";
import {
  Button,
  CircularProgress,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import { useTestSuiteStore } from "../../stores/testSuitesStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useParams } from "react-router-dom";

type AddTestSuiteModalProps = {
  open: boolean;
  onClose: () => void;
};

export const AddTestSuiteModal = ({
  open,
  onClose,
}: AddTestSuiteModalProps) => {
  const [name, setName] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { createTestSuite } = useTestSuiteStore();
  const { show, component: snackBar } = useSnackbar();

  const onClickAdd = () => {
    if (name === "") {
      show("Name cannot be empty", "error");
      return;
    }
    setIsLoading(true);

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
        setIsLoading(false);
      });
  };

  const resetState = () => {
    setName("");
    setIsLoading(false);
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

        <div className="text-2xl font-bold">Add Test Suite</div>
        <div className="w-full border-b-[0.05px] my-4" />
        <div className="flex flex-col space-y-4">
          <TextField
            label={`Test Suite Name`}
            placeholder={`Test Suite Name`}
            size="small"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
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

type EditTestSuiteModalProps = {
  open: boolean;
  onClose: () => void;
  name: string;
};

export const EditTestSuiteModal = ({
  open,
  onClose,
  name,
}: EditTestSuiteModalProps) => {
  const [newName, setName] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { editTestSuite } = useTestSuiteStore();
  const { show, component: snackBar } = useSnackbar();
  const { testSuiteId } = useParams();

  React.useEffect(() => {
    setName(name);
  }, [name]);

  const onClickEdit = () => {
    if (newName === "") {
      show("Name cannot be empty", "error");
      return;
    }
    setIsLoading(true);

    editTestSuite(testSuiteId as string, newName)
      .then(() => {
        show("Test Suite created successfully", "success");
        resetState();
        onClose();
      })
      .catch(() => {
        show("Test Suite update failed", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const resetState = () => {
    setName("");
    setIsLoading(false);
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
        <div className="text-2xl font-bold">Edit Test Suite</div>
        <div className="w-full border-b-[0.05px] my-4" />
        <div className="flex flex-col space-y-4">
          <TextField
            label={`Test Suite Name`}
            placeholder={`Test Suite Name`}
            size="small"
            value={newName}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="flex flex-row justify-end mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={onClickEdit}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};

type DeleteTestSuiteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  testSuite: { id: string; name: string };
};
export const DeleteTestSuiteModal = ({
  isOpen,
  onClose,
  testSuite,
}: DeleteTestSuiteModalProps) => {
  const [verifyDelete, setVerifyDelete] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { deleteTestSuite } = useTestSuiteStore();

  const handleDeleteTestSuite = useCallback(() => {
    if (testSuite.name !== verifyDelete) {
      showSnackbar("Please type the name of the test suite to delete", "error");
      return;
    }
    setIsLoading(true);
    deleteTestSuite(testSuite.id)
      .then(() => {
        onClose();
      })
      .catch(() => {
        showSnackbar("Error deleting test suite", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [showSnackbar, onClose, verifyDelete, testSuite]);

  return (
    <>
      {snackBar}
      <Modal
        open={isOpen}
        onClose={onClose}
        className="flex justify-center items-center border-0"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm">
          <div className="text-2xl font-bold">Delete Test Suite</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <div className="flex flex-col space-y-2">
            <TextField
              label={"Delete"}
              placeholder={`Type "${testSuite.name}" to delete`}
              value={verifyDelete}
              onChange={(event) => setVerifyDelete(event.target.value)}
            />
          </div>

          <div className="flex flex-row justify-end mt-4">
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteTestSuite}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};
