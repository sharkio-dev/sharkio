import {
  Button,
  OutlinedInput,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import debounce from "lodash/debounce";
import randomString from "random-string";
import React from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { useSniffersStore } from "../../stores/sniffersStores";
import { validateHttpUrlFormat } from "../../utils/ValidateHttpUrl";
import { handleEnterKeyPress } from "../../utils/handleEnterKeyPress";
import { toLowerCaseNoSpaces } from "../../utils/texts";
import { LoadingIcon } from "./LoadingIcon";

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

  const onDomainChange = (newValue: string) => {
    handleChange(newValue);
    setIsValid(validateHttpUrlFormat(newValue));
  };

  return (
    <div className="flex w-full flex-col items-center">
      <SimpleDomainComponent
        domain={value}
        isValid={isValid}
        onDomainChange={onDomainChange}
        onNextClicked={onNextClicked}
      />
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
function SimpleDomainComponent(props: {
  domain: string;
  isValid: boolean;
  onDomainChange: (domain: string) => void;
  onNextClicked: () => void;
}) {
  const [error, setError] = React.useState<string | null>(null);
  const DEBOUNCE_TIME = 1000;

  const handleDomainChange = (newValue: string) => {
    props.onDomainChange(newValue);
    debouncedSearch(newValue);
  };

  const debouncedSearch = React.useCallback(
    debounce((newValue: string) => {
      if (!validateHttpUrlFormat(newValue)) {
        setError("The URL is not in the https://example.com format.");
      } else {
        setError(null);
      }
    }, DEBOUNCE_TIME),
    [],
  );

  const handleKeyDown = handleEnterKeyPress(props.onNextClicked, props.isValid);

  return (
    <>
      <div className="font-sarif self-start text-2xl font-bold">
        What is your server's domain?
      </div>
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <TextField
          value={props.domain}
          className="w-1/2"
          placeholder="https://example.com"
          onChange={(e) => handleDomainChange(e.target.value)}
          error={Boolean(error)}
          helperText={error}
          onKeyDown={handleKeyDown}
        />
      </div>
    </>
  );
}

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
  const handleKeyDown = handleEnterKeyPress(onNextClicked, value !== "");

  return (
    <div className="flex w-full flex-col items-center">
      <div className="font-sarif self-start text-2xl font-bold">
        Give your proxy a name
      </div>
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <OutlinedInput
          className="w-1/2"
          placeholder="Proxy name"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
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
        You have successfully created a proxy!
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
  const [domain, setDomain] = React.useState("https://");
  const [name, setName] = React.useState("");
  const { createSniffer, loadingSniffers } = useSniffersStore();
  const [subdomain, _] = React.useState<string>(
    randomString({ length: 5 }).toLowerCase(),
  );
  const navigator = useNavigate();

  const handleCreateSniffer = () => {
    createSniffer({
      name,
      downstreamUrl: domain,
      port: 80,
      subdomain: `${toLowerCaseNoSpaces(name)}-${subdomain}`,
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
          <DomainStep
            value={domain}
            handleChange={setDomain}
            onNextClicked={() => setActiveStep(2)}
            onBackClicked={() => setActiveStep(0)}
          />
        )}
        {activeStep === 1 && (
          <NameStep
            onBackClicked={() => setActiveStep(1)}
            onNextClicked={handleCreateSniffer}
            value={name}
            handleChange={setName}
            isLoading={loadingSniffers}
          />
        )}
        {activeStep === 2 && (
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
