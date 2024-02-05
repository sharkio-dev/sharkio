import {
  Avatar,
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
import { useEnterKeyPress } from "./useEnterKeyPress";

interface EnvStepProps {
  onNextClicked: () => void;
  value: boolean;
  handleChange: (newValue: boolean) => void;
}

const EnvStep = ({ onNextClicked, value, handleChange }: EnvStepProps) => {
  useEnterKeyPress(onNextClicked);

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
  isLocal: boolean;
  handleChange: (newValue: string) => void;
}
const DomainStep = ({
  onNextClicked,
  onBackClicked,
  value,
  isLocal,
  handleChange,
}: DomainStepProps) => {
  const [isValid, setIsValid] = React.useState(false);
  useEnterKeyPress(onNextClicked);

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
      {!isLocal ? (
        <>
          <SimpleDomainComponent
            domain={value}
            onDomainChange={onDomainChange}
          />
        </>
      ) : (
        <>
          <NgrokComponent domain={value} onDomainChange={onDomainChange} />
        </>
      )}
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
  onDomainChange: (domain: string) => void;
}) {
  return (
    <>
      <div className="font-sarif self-start text-2xl font-bold">
        What is your server's domain?
      </div>
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <OutlinedInput
          value={props.domain}
          className="w-1/2"
          placeholder="https://example.com"
          onChange={(e) => props.onDomainChange(e.target.value)}
        />
      </div>
    </>
  );
}

function NgrokComponent(props: {
  domain: string;
  onDomainChange: (domain: string) => void;
}) {
  return (
    <>
      <div className="font-sarif self-start text-2xl font-bold">
        Setup your ngrok server!
      </div>
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <List className="">
          <ListItem>
            <ListItemAvatar>
              <Avatar>1</Avatar>
            </ListItemAvatar>
            <Link href="https://ngrok.com/docs/getting-started/">
              <ListItemText primary="Install ngrok" />
            </Link>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>2</Avatar>
            </ListItemAvatar>
            <div className="block w-full">
              <ListItemText primary="Run ngrok" />
              <Box
                component="div"
                className="w-full bg-black py-3 pl-2 font-[monospace] text-white"
              >
                ngrok http http://localhost:PORT
              </Box>
            </div>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>3</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Paste the link" />
            <OutlinedInput
              value={props.domain}
              className="w-1/2"
              placeholder="https://example.com"
              onChange={(e) => props.onDomainChange(e.target.value)}
            />
          </ListItem>
        </List>
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
  useEnterKeyPress(onNextClicked);

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
  useEnterKeyPress(onNextClicked);
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
  const [isLocal, setIsLocal] = React.useState(false);
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
        {activeStep === 1 && (
          <DomainStep
            value={domain}
            handleChange={setDomain}
            isLocal={isLocal}
            onNextClicked={() => setActiveStep(2)}
            onBackClicked={() => setActiveStep(0)}
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
