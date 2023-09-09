import { Button, Card, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { executeRequest } from "../../api/api";
import { RequestsMetadataContext } from "../../context/requests-context";
import styles from "./invocation.module.scss";
import { SnifferSelector } from "../../components/sniffer-selector/sniffer-selector";

export const InvocationEditor: React.FC = () => {
  const { serviceId, requestId, invocationId } = useParams();
  const [response, setResponse] = useState<any>();
  const { loadData, requestsData } = useContext(RequestsMetadataContext);
  const [body, setBody] = useState<any>();
  const [headers, setHeaders] = useState<any>();
  const [invocation, setInvocation] = useState<any>();
  const [req, setReq] = useState<any>();

  useEffect(() => {
    loadData?.();
  }, []);

  useEffect(() => {
    const selectedReq = requestsData?.find(
      (request) => request.id === requestId
    );
    const selectedInvocation = selectedReq?.invocations.find(
      (invocation) => invocation.id === invocationId
    );

    setReq(selectedReq);
    setInvocation(selectedInvocation);
    setBody(JSON.stringify(selectedInvocation?.body, null, 2));
    setHeaders(JSON.stringify(selectedInvocation?.headers, null, 2));
  }, [requestsData]);

  const handleExecuteClicked = () => {
    if (!serviceId || !req || !invocation) {
      console.error("service was not found for requests");
      return;
    }

    executeRequest(+serviceId, req.url, req.method, invocation).then(
      (response) => {
        setResponse(response);
      }
    );
  };

  return (
    <>
      <Card className={styles.card}>
        <Typography variant="h6" gutterBottom>
          Invocation
        </Typography>
        <SnifferSelector selectedSnifferPort={serviceId ?? ""} disabled />
        <TextField
          className={"w-full"}
          label="URL"
          placeholder="{}"
          value={req?.url}
          disabled={true}
        />
        <TextField
          className={"w-full"}
          label="Body"
          placeholder="{}"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          multiline
          rows={5}
        />
        <TextField
          className={"w-full"}
          label="Headers"
          onChange={(e) => setHeaders(e.target.value)}
          value={headers}
          multiline
          rows={5}
        />
        <Button onClick={handleExecuteClicked}>Execute</Button>
      </Card>
      <Card className={styles.card}>
        <Typography variant="h6" gutterBottom>
          Response
        </Typography>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </Card>
    </>
  );
};
