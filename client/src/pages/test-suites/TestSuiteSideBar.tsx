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
        open={addTestSuiteModalOpen}
        onClose={() => {
          setAddTestSuiteModalOpen(false);
          navigator("#", { replace: true });
        }}
        type="Test Suite"
      />
    </>
  );
};

type AddTestSuiteModalProps = {
  open: boolean;
  onClose: () => void;
  type?: "Test Suite" | "Test Endpoint";
};

export const AddTestSuiteModal = ({
  open,
  onClose,
  type = "Test Suite",
}: AddTestSuiteModalProps) => {
  const [name, setName] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [formType, setFormType] = React.useState<string>(type);
  const { createTestSuite } = useTestSuiteStore();
  const { show, component: snackBar } = useSnackbar();
  const { sniffers, loadSniffers } = useSniffersStore();
  const [sniffer, setSniffer] = React.useState<string>("");
  const [endpoints, setEndpoints] = React.useState<EndpointType[]>([]);
  const [endpoint, setEndpoint] = React.useState<string>("");
  const [invocations, setInvocations] = React.useState<InvocationType[]>([]);
  const [invocation, setInvocation] = React.useState<string>("");
  const { testSuiteId } = useParams();

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
    if (formType === "Test Suite") {
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
    setFormType(type);
    setSniffer("");
    setEndpoints([]);
    setEndpoint("");
    setInvocations([]);
    setInvocation("");
  };

  useEffect(() => {
    open && loadSniffers();
  }, [open]);

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

        <div className="text-2xl font-bold">Add {formType}</div>
        <div className="w-full border-b-[0.05px] my-4" />
        <div className="flex flex-col space-y-4">
          <SelectComponent
            options={[
              { value: "Test Suite", label: "Test Suite" },
              { value: "Test Endpoint", label: "Test Endpoint" },
            ]}
            title="Type"
            value={formType}
            setValue={(value: string) => setFormType(value)}
          />
          <TextField
            label={`${formType} Name`}
            placeholder={`${formType} Name`}
            size="small"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {formType === "Test Endpoint" && (
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
