import {
  Button,
  OutlinedInput,
  Step,
  StepLabel,
  Stepper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import randomString from "random-string";
import React from "react";
import { GiCancel, GiConfirmed } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { useSniffersStore } from "../../stores/sniffersStores";
import { LoadingIcon } from "./LoadingIcon";

interface EnvStepProps {
  onNextClicked: () => void;
  value: boolean;
  handleChange: (newValue: boolean) => void;
}
const EnvStep = ({ onNextClicked, value, handleChange }: EnvStepProps) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="font-sarif self-start text-2xl font-bold">
        Is your server local?
      </div>
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <ToggleButtonGroup
          color="primary"
          value={value}
          size="large"
          exclusive
          onChange={(_, newValue) => {
            if (typeof newValue === "boolean") handleChange(newValue);
          }}
        >
          <ToggleButton value={true} className="w-32">
            <GiConfirmed className="mr-2 text-2xl text-green-400" />
            <div className="text-lg">Yes</div>
          </ToggleButton>
          <ToggleButton value={false} className="w-32">
            <GiCancel className="mr-2 text-2xl text-red-400" />
            <div className="text-lg">No</div>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="mt-8 flex w-full flex-row justify-between">
        <Button color="warning" disabled>
          Back
        </Button>
        <Button onClick={onNextClicked}>Next</Button>
      </div>
    </div>
  );
};
interface DomainStepProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  value: string;
  handleChange: (newValue: string) => void;
}
const DomainStep = ({
  onNextClicked,
  onBackClicked,
  value,
  handleChange,
}: DomainStepProps) => {
  const [isValid, setIsValid] = React.useState(false);
  const isValidHttpUrl = (string: string) => {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  };

  const onDomainChange = (newValue: string) => {
    handleChange(newValue);
    setIsValid(isValidHttpUrl(newValue));
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="font-sarif self-start text-2xl font-bold">
        What is your server's domain?
      </div>
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <OutlinedInput
          value={value}
          className="w-1/2"
          placeholder="https://example.com"
          onChange={(e) => onDomainChange(e.target.value)}
        />
      </div>
      <div className="mt-8 flex w-full flex-row justify-between">
        <Button color="warning" onClick={onBackClicked}>
          Back
        </Button>
        <Button onClick={onNextClicked} disabled={!isValid}>
          Next
        </Button>
      </div>
    </div>
  );
};
interface PortStepProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  value: string;
  handleChange: (newValue: string) => void;
}
const PortStep = ({
  onNextClicked,
  onBackClicked,
  value,
  handleChange,
}: PortStepProps) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="font-sarif self-start text-2xl font-bold">
        What is your server's port?
      </div>
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <OutlinedInput
          className="w-1/2"
          placeholder="8080"
          type="number"
          value={value}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
        />
      </div>
      <div className="mt-8 flex w-full flex-row justify-between">
        <Button color="warning" onClick={onBackClicked}>
          Back
        </Button>
        <Button onClick={onNextClicked} disabled={value === ""}>
          Next
        </Button>
      </div>
    </div>
  );
};
interface NameStepProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  value: string;
  handleChange: (newValue: string) => void;
  isLoading: boolean;
}
const NameStep = ({
  onBackClicked,
  onNextClicked,
  value,
  handleChange,
  isLoading,
}: NameStepProps) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="font-sarif self-start text-2xl font-bold">
        Give your sniffer a name
      </div>
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <OutlinedInput
          className="w-1/2"
          placeholder="Sniffer name"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <div className="mt-8 flex w-full flex-row justify-between">
        <Button color="warning" onClick={onBackClicked}>
          Back
        </Button>
        {isLoading ? (
          <LoadingIcon />
        ) : (
          <Button onClick={onNextClicked} disabled={value === ""}>
            {" "}
            Next{" "}
          </Button>
        )}
      </div>
    </div>
  );
};
const DoneStep = ({ onNextClicked }: { onNextClicked: () => void }) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="font-sarif self-start text-2xl font-bold">
        You have successfully created a sniffer!
      </div>
      <div className="flex h-[50vh] w-full flex-col items-center justify-center"></div>
      <div className="mt-8 flex w-full flex-row-reverse justify-between">
        <Button color="success" onClick={onNextClicked}>
          Done
        </Button>
      </div>
    </div>
  );
};

export const AddSnifferPage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLocal, setIsLocal] = React.useState(false);
  const [domain, setDomain] = React.useState("https://");
  const [port, setPort] = React.useState("");
  const [name, setName] = React.useState("");
  const { createSniffer, loadingSniffers } = useSniffersStore();
  const [subdomain, _] = React.useState<string>(
    randomString({ length: 5 }).toLowerCase(),
  );
  const navigator = useNavigate();

  const handlePortChange = (val: string) => {
    if (Number(val) > 65535) {
      setPort("65535");
      return;
    }
    if (Number(val) < 0) {
      setPort("0");
      return;
    }
    setPort(val.replace("-", ""));
  };

  const handleCreateSniffer = () => {
    createSniffer({
      name,
      downstreamUrl: isLocal ? "https://localhost" : domain,
      port: isLocal ? Number(port) : 80,
      subdomain: `${name}-${subdomain}`,
    }).then(() => {
      setActiveStep(3);
    });
  };

  return (
    <div
      className={`flex flex-col bg-tertiary h-[calc(vh-96px)] max-h-[calc(100vh-96px)] w-[calc(100vw-56px)] p-4`}
    >
      <div className="flex w-3/4 flex-col self-center">
        <Stepper activeStep={activeStep} className="mb-8 w-full self-center">
          <Step key={"Environment"}>
            <StepLabel>{"Environment"}</StepLabel>
          </Step>
          <Step key={"Domain"}>
            <StepLabel>{"Domain"}</StepLabel>
          </Step>
          <Step key={"Name"}>
            <StepLabel>{"Name"}</StepLabel>
          </Step>
          <Step key={"Done"}>
            <StepLabel>{"Done"}</StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 && (
          <EnvStep
            onNextClicked={() => setActiveStep(1)}
            value={isLocal}
            handleChange={setIsLocal}
          />
        )}
        {activeStep === 1 && !isLocal && (
          <DomainStep
            value={domain}
            handleChange={setDomain}
            onNextClicked={() => setActiveStep(2)}
            onBackClicked={() => setActiveStep(0)}
          />
        )}
        {activeStep === 1 && isLocal && (
          <PortStep
            onNextClicked={() => setActiveStep(2)}
            onBackClicked={() => setActiveStep(0)}
            value={port}
            handleChange={handlePortChange}
          />
        )}
        {activeStep === 2 && (
          <NameStep
            onBackClicked={() => setActiveStep(1)}
            onNextClicked={handleCreateSniffer}
            value={name}
            handleChange={setName}
            isLoading={loadingSniffers}
          />
        )}
        {activeStep === 3 && (
          <DoneStep
            onNextClicked={() => {
              navigator(routes.ROOT);
            }}
          />
        )}
      </div>
    </div>
  );
};
