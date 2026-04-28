import React from "react";
import { BodySection } from "../../components/editors/BodySection";
import { HeaderSection } from "../../components/HeaderSection";
import { Mock, MockResponse } from "../../stores/mockStore";
import { BodyHeaderToggle } from "./BodyHeaderStatusToggle";
import StatusCodeSelector from "../flows/StatusCodeSelector";
import TextField from "@mui/material/TextField";
import { Button, InputAdornment, Tooltip } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { useSniffersStore } from "../../stores/sniffersStores";
import { getSnifferDomain } from "../../utils/getSnifferUrl";
import { useSnackbar } from "../../hooks/useSnackbar";

interface MockResponseDetailsProps {
  response?: MockResponse;
  handleResponseChange: (value: MockResponse) => void;
  mock?: Mock;
}
export const MockResponseDetails: React.FC<MockResponseDetailsProps> = ({
  response,
  handleResponseChange,
  mock,
}) => {
  const { sniffers } = useSniffersStore();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const sniffer = sniffers.find((s) => s.id === mock?.snifferId);

  const [editedResponse, setEditedResponse] = React.useState<MockResponse>();

  React.useEffect(() => {
    if (response) {
      setEditedResponse(response);
    }
  }, [response]);

  const copyCurlCommand = () => {
    if (!mock || !sniffer) {
      showSnackbar("Cannot build curl command", "error");
      return;
    }
    const url = `${getSnifferDomain(sniffer.subdomain)}${mock.url}`;
    const headers = (editedResponse?.headers ?? {}) as Record<string, string>;
    const headerFlags = Object.entries(headers)
      .map(([key, value]) => ` \\\n  -H '${key}: ${value}'`)
      .join("");
    const curl = `curl -X ${mock.method} '${url}'${headerFlags}`;
    navigator.clipboard.writeText(curl).then(() => {
      showSnackbar("Curl command copied to clipboard", "success");
    });
  };

  const onResponseChange = (value: MockResponse) => {
    setEditedResponse(value);
    handleResponseChange(value);
  };

  const [section, setSection] = React.useState<"Status" | "Body" | "Headers">(
    "Body",
  );

  return (
    <div className="flex flex-col h-full py-2 rounded-md overflow-y-auto">
      {snackBar}
      {editedResponse && (
        <>
          {mock && (
            <div className="flex flex-row items-center justify-end mb-2">
              <Tooltip title="Copy curl command for the request">
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={(e) => {
                      e.stopPropagation();
                      copyCurlCommand();
                    }}
                    disabled={!sniffer}
                  >
                    Copy as curl
                  </Button>
                </span>
              </Tooltip>
            </div>
          )}
          <BodyHeaderToggle
            value={section}
            setValue={(value: string) => setSection(value as any)}
          />
          {section === "Body" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex flex-row items-center space-x-4">
                <StatusCodeSelector
                  value={editedResponse.status.toString() || ""}
                  setValue={(value: string) => {
                    onResponseChange({ ...editedResponse, status: +value });
                  }}
                />
                <TextField
                  label="Delay"
                  type="number"
                  size="small"
                  value={editedResponse.delay ?? 0}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const parsed =
                      raw === "" ? 0 : Math.max(0, Math.floor(Number(raw)));
                    const delay = Number.isFinite(parsed) ? parsed : 0;
                    onResponseChange({ ...editedResponse, delay });
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">ms</InputAdornment>
                    ),
                    inputProps: { min: 0, step: 100 },
                  }}
                />
              </div>
              <BodySection
                language={
                  editedResponse.body.includes("{{") ? "handlebars" : "json"
                }
                body={editedResponse.body || ""}
                onBodyChange={(value: any) => {
                  onResponseChange({ ...editedResponse, body: value });
                }}
                showPreviousSteps={false}
              />
            </div>
          )}

          {section === "Headers" && (
            <HeaderSection
              headers={editedResponse.headers || {}}
              handleHeadersChange={(headers: object) => {
                onResponseChange({ ...editedResponse, headers });
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
