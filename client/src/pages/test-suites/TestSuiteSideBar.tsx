import React, { useEffect } from "react";
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
import { useSniffersStore } from "../../stores/sniffersStores";
import { getEnpoints, getInvocations } from "../../api/api";
import { EndpointType, InvocationType } from "../sniffers/types";
import { BackendAxios } from "../../api/backendAxios";
import { useNavigate, useParams } from "react-router-dom";

export const TestSuiteSideBar = () => {
  const [addTestSuiteModalOpen, setAddTestSuiteModalOpen] =
    React.useState<boolean>(false);
  const { loadTestSuites, testSuites } = useTestSuiteStore();
  const navigator = useNavigate();
  const { testSuiteId, testId } = useParams();

  React.useEffect(() => {
    loadTestSuites().then((res) => {
      if (res.length > 0 && !testId) {
        navigator("/test-suites/" + res[0].id, { replace: true });
      }
    });
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
          value={testSuiteId || ""}
          setValue={(value: string) => navigator("/test-suites/" + value)}
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
        testSuiteId={testSuiteId || ""}
        open={addTestSuiteModalOpen}
        onClose={() => setAddTestSuiteModalOpen(false)}
      />
    </>
  );
};

type AddTestSuiteModalProps = {
  open: boolean;
  onClose: () => void;
  testSuiteId: string;
};

const AddTestSuiteModal = ({
  open,
  onClose,
  testSuiteId,
}: AddTestSuiteModalProps) => {
  const [name, setName] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [type, setType] = React.useState<string>("Test Suite");
  const { createTestSuite } = useTestSuiteStore();
  const { show, component: snackBar } = useSnackbar();
  const { sniffers, loadSniffers } = useSniffersStore();
  const [sniffer, setSniffer] = React.useState<string>("");
  const [endpoints, setEndpoints] = React.useState<EndpointType[]>([]);
  const [endpoint, setEndpoint] = React.useState<string>("");
  const [invocations, setInvocations] = React.useState<InvocationType[]>([]);
  const [invocation, setInvocation] = React.useState<string>("");

  const onSnifferPicked = (value: string) => {
    setSniffer(value);

    getEnpoints(value).then((endpoints) => {
      setEndpoints(endpoints);
    });
  };

  const onEndpointPicked = (value: string) => {
    setEndpoint(value);
    getInvocations(value).then((invocations) => {
      setInvocations(invocations);
    });
  };

  const onClickAdd = () => {
    if (name === "") {
      show("Name cannot be empty", "error");
      return;
    }
    if (type === "Test Suite") {
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
    } else {
      if (!invocation) {
        show("Invocation cannot be empty", "error");
        return;
      }
      setIsLoading(true);
      console.log({ invocation, testSuiteId });

      BackendAxios.post(`/test-suites/${testSuiteId}/import/${invocation}`, {
        name,
      })
        .then(() => {
          show("Test Endpoint created successfully", "success");
          resetState();
          onClose();
        })
        .catch(() => {
          show("Test Endpoint creation failed", "error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const resetState = () => {
    setName("");
    setIsLoading(false);
    setType("Test Suite");
    setSniffer("");
    setEndpoints([]);
    setEndpoint("");
    setInvocations([]);
    setInvocation("");
  };

  useEffect(() => {
    loadSniffers();
  }, []);

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
          <TextField
            label={`${type} Name`}
            placeholder={`${type} Name`}
            size="small"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {type === "Test Endpoint" && (
            <>
              <SelectComponent
                options={sniffers.map((sniffer) => ({
                  value: sniffer.id,
                  label: sniffer.name,
                }))}
                title="Sniffer"
                value={sniffer}
                setValue={(value: string) => onSnifferPicked(value)}
              />
              <SelectComponent
                options={endpoints.map((endpoint) => ({
                  value: endpoint.id,
                  label: endpoint.method + " " + endpoint.url,
                }))}
                disabled={endpoints.length === 0}
                title="Endpoint"
                value={endpoint}
                setValue={(value: string) => onEndpointPicked(value)}
              />
              <SelectComponent
                options={invocations.map((invocation) => ({
                  value: invocation.id,
                  label: invocation?.response?.status + " " + invocation.url,
                }))}
                disabled={invocations.length === 0}
                title="Invocation"
                value={invocation}
                setValue={(value: string) => setInvocation(value)}
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
