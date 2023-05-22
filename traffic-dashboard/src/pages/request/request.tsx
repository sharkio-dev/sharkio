import { PlayArrow } from "@mui/icons-material";
import {
  Button,
  Card,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { executeRequest } from "../../api/api";
import { HttpMethod } from "../../components/http-method/http-method";
import { RequestsMetadataContext } from "../../context/requests-context";
import styles from "./requestCard.module.scss";

export const RequestPage: React.FC = () => {
  const { id } = useParams();
  const [request, setRequest] = useState<any>(undefined);
  const requests = useContext(RequestsMetadataContext);

  useEffect(() => {
    if (id !== undefined) {
      const request = requests.data.find((request: any) => {
        return request.id === id;
      });

      setRequest(request);
    }
  }, [id]);

  const handleExecuteClicked = (
    url: string,
    method: string,
    invocation: any
  ) => {
    executeRequest(url, method, invocation);
  };

  return (
    <div className={styles.requestPageContainer}>
      {request && (
        <>
          <Card className={styles.requestCardContainer}>
            <div className={styles.cardTitle}>
              <Typography variant="h6">Request</Typography>
            </div>
            <HttpMethod method={request.method} />
            {request.url}
            <Typography>hit count: {request.hitCount}</Typography>
            <Typography>
              last invocation: {request.lastInvocationDate}
            </Typography>
          </Card>
          {/* <Tab></Tab> */}
          <Card>
            <div className={styles.cardTitle}>
              <Typography variant="h6">Invocations</Typography>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>execute</TableCell>
                  <TableCell>timestamp</TableCell>
                  <TableCell>id</TableCell>
                  <TableCell>body</TableCell>
                  <TableCell>params</TableCell>
                  <TableCell>headers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {request.invocations.map((invocation: any) => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Button
                          onClick={() => {
                            handleExecuteClicked(
                              request.url,
                              request.method,
                              invocation
                            );
                          }}
                        >
                          <PlayArrow color="success"></PlayArrow>
                        </Button>
                      </TableCell>
                      <TableCell>{invocation.id}</TableCell>
                      <TableCell>{invocation.timestamp}</TableCell>
                      <TableCell>{JSON.stringify(invocation.body)}</TableCell>
                      <TableCell>{JSON.stringify(invocation.params)}</TableCell>
                      <TableCell>
                        {JSON.stringify(invocation.headers)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
          <Card>
            <div className={styles.cardTitle}>
              <Typography variant="h6">OpenAPI</Typography>
            </div>
          </Card>
          <Card>
            <div className={styles.cardTitle}>
              <Typography variant="h6">Json Schema</Typography>
            </div>
          </Card>
          <Card>
            <div className={styles.cardTitle}>
              <Typography variant="h6">Raw JSON</Typography>
            </div>
            <pre>{JSON.stringify(request, null, 2)}</pre>
          </Card>
        </>
      )}
    </div>
  );
};
