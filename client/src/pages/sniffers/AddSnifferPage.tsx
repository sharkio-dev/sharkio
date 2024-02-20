import { ArrowDownward } from "@mui/icons-material";
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
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { SnifferType, useSniffersStore } from "../../stores/sniffersStores";
import { validateHttpUrlFormat } from "../../utils/ValidateHttpUrl";
import { getSnifferDomain } from "../../utils/getSnifferUrl";
import { handleEnterKeyPress } from "../../utils/handleEnterKeyPress";
import { toLowerCaseNoSpaces } from "../../utils/texts";
import { LoadingIcon } from "./LoadingIcon";
import Confetti from "react-confetti";

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
      <div className="font-sarif text-2xl font-bold">
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
      <div className="font-sarif text-2xl font-bold">
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

const DoneStep = ({
  onNextClicked,
  createdProxy,
}: {
  onNextClicked: () => void;
  createdProxy?: SnifferType;
}) => {
  const [showConfetti, setShowConfetti] = React.useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  }, []);
  return (
    <div className="flex w-full flex-col">
      {showConfetti && <Confetti />}
      <div className="font-sarif self-start text-2xl font-bold mb-20 text-center w-full">
        You have successfully created a proxy!
      </div>
      <div className="font-sarif self-start w-full h-[40vh]">
        <span className="block mb-4 w-full text-center">Requests from</span>
        <TextField
          disabled
          className="w-full"
          size="small"
          value={getSnifferDomain(createdProxy?.subdomain ?? "")}
        />
        {/* <div className="flex w-full justify-center mt-4 mb-4"> */}
        <div className="w-full mt-4 mb-4">
          <div className="w-full flex justify-center mb-2">
            <span className="block w-full text-center">Are forwarded to</span>
          </div>
          <div className="flex justify-center">
            <ArrowDownward></ArrowDownward>
          </div>
        </div>
        {/* </div> */}

        <TextField
          disabled
          className="w-full"
          size="small"
          value={createdProxy?.downstreamUrl}
        />
      </div>
      <div className="mt-8 flex w-full flex-row-reverse justify-center">
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
  const [createdProxy, setCreatedProxy] = React.useState<
    SnifferType | undefined
  >(undefined);

  const handleCreateSniffer = () => {
    createSniffer({
      name,
      downstreamUrl: domain,
      port: 80,
      subdomain: `${toLowerCaseNoSpaces(name)}-${subdomain}`,
    }).then((data) => {
      setCreatedProxy(data);
      setActiveStep(2);
    });
  };

  return (
    <div
      className={`flex flex-col bg-tertiary h-full w-[calc(100vw-56px)] p-4`}
    >
      <div className="flex h-full w-3/4 flex-col self-center">
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
            onNextClicked={() => setActiveStep(1)}
            onBackClicked={() => setActiveStep(0)}
          />
        )}
        {activeStep === 1 && (
          <NameStep
            onBackClicked={() => setActiveStep(0)}
            onNextClicked={handleCreateSniffer}
            value={name}
            handleChange={setName}
            isLoading={loadingSniffers}
          />
        )}
        {activeStep === 2 && (
          <DoneStep
            createdProxy={createdProxy}
            onNextClicked={() => {
              navigator(routes.ROOT);
            }}
          />
        )}
      </div>
    </div>
  );
};
