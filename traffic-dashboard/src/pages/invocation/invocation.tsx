import { Button, Card, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { executeRequest } from "../../api/api";
import { RequestsMetadataContext } from "../../context/requests-context";
import styles from "./invocation.module.scss";

export const InvocationEditor: React.FC = () => {
  const { serviceId, requestId, invocationId } = useParams();
  const { loadData, requestsData } = useContext(RequestsMetadataContext);
  const req = requestsData?.find((request) => request.id === requestId);
  const invocation = req?.invocations.find(
    (invocation) => invocation.id === invocationId
  );

  useEffect(() => {
    loadData?.();
  }, []);

  const handleExecuteClicked = () => {
    if (!serviceId || !req || !invocation) {
      console.error("service was not found for requests");
      return;
    }

    executeRequest(+serviceId, req.url, req.method, invocation);
  };

  return (
    <>
      <Card className={styles.card}>
        <Typography variant="h6" gutterBottom>
          Invocation
        </Typography>
        <TextField
          className={"w-full"}
          label="Data"
          placeholder="{}"
          defaultValue={req?.url}
          disabled={true}
        />
        <TextField
          className={"w-full"}
          label="Data"
          placeholder="{}"
          defaultValue={JSON.stringify(invocation?.body)}
          disabled={true}
          multiline
          rows={10}
        />
        <TextField
          className={"w-full"}
          label="Data"
          placeholder="{}"
          defaultValue={JSON.stringify(invocation?.headers)}
          disabled={true}
          multiline
          rows={10}
        />
        <Button onClick={handleExecuteClicked}>Execute</Button>
      </Card>
      <Card className={styles.card}>
        <Typography variant="h6" gutterBottom>
          Response
        </Typography>
      </Card>
    </>
  );
};
