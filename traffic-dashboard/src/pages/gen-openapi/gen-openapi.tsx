import { FileDownload } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Autocomplete,
  Button,
  Card,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import copy from "copy-to-clipboard";
import saveAs from "file-saver";
import React, { useContext, useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { RequestsMetadataContext } from "../../context/requests-context";
import { useSnackbar } from "../../hooks/useSnackbar";
import { JsonToOpenapi } from "../../lib/generateOpenapi";
import { OpenAPIDocument } from "../../lib/openapi.interface";
import { InterceptedRequest, SnifferConfig } from "../../types/types";
import styles from "./gen-openapi.module.scss";

export const GenOpenAPI: React.FC = () => {
  const snackBar = useSnackbar();
  const {
    requestsData: requests,
    servicesData: services,
    loadData,
  } = useContext(RequestsMetadataContext);

  const [openApiDoc, setOpenApiDoc] = useState<OpenAPIDocument>();

  const onSubmit = (serviceId: string) => {
    const filteredRequests: InterceptedRequest[] =
      requests?.filter((req) => req.serviceId === serviceId) || [];

    setOpenApiDoc(
      JsonToOpenapi(filteredRequests, undefined, undefined, undefined),
    );
  };

  useEffect(() => {
    loadData?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExportClicked = () => {
    const file = new Blob([JSON.stringify(openApiDoc, null, 2)], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(file, "config.json");
  };
  const handleCopyClicked = () => {
    try {
      copy(JSON.stringify(openApiDoc, null, 2));
      snackBar.show("Copied to clipboard!", "success");
    } catch (e) {
      snackBar.show("Failed to copy clipboard!", "success");
    }
  };

  return (
    <div>
      {snackBar.component}
      <Card className={styles.card}>
        <Autocomplete
          freeSolo
          disablePortal
          getOptionLabel={(option: SnifferConfig | string) => {
            return typeof option === "object" ? option.name : option;
          }}
          options={services ?? []}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Service" />}
          onChange={(_, value: string | SnifferConfig | null) => {
            const newValue =
              typeof value === "object" ? value && value.id : value;
            newValue && onSubmit(newValue);
          }}
        />
      </Card>

      <div>
        <Card className={styles.resultCard}>
          <div>
            <div className={styles.resultHeader}>
              <Typography>Result</Typography>
              <Tooltip title={"export"}>
                <Button onClick={handleExportClicked}>
                  <FileDownload />
                </Button>
              </Tooltip>{" "}
              <Button onClick={handleCopyClicked}>
                <ContentCopyIcon />
              </Button>
            </div>
            <TextField
              multiline
              fullWidth
              minRows={8}
              maxRows={8}
              value={JSON.stringify(openApiDoc, null, 2) ?? "Empty"}
              disabled
            />
          </div>
          <div className={styles.swaggerContainer}>
            <SwaggerUI spec={openApiDoc} />
          </div>
        </Card>
      </div>
    </div>
  );
};
