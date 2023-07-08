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
  Tabs,
  Typography,
} from "@mui/material";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { executeRequest } from "../../api/api";
import { HttpMethod } from "../../components/http-method/http-method";
import { RequestsMetadataContext } from "../../context/requests-context";
import {
  generateCurlCommand,
  generateJsonSchema,
  jsonSchemaToTypescriptInterface,
} from "../../lib/jsonSchema";
import styles from "./requestCard.module.scss";

export const RequestPage: React.FC = () => {
  const { id } = useParams();
  const [typescript, setTypescript] = useState<any>(undefined);
  const [curl, setCurl] = useState<any>(undefined);
  const [schema, setSchema] = useState<any>(undefined);
  const [request, setRequest] = useState<any>(undefined);
  const [tab, setTab] = useState(0);
  const { loadData, 
          requestsData: requests,
        } = useContext(RequestsMetadataContext);

  useEffect(() => {
    loadData?.();
  }, []);

  useEffect(() => {
    console.log(requests);
    const request = requests.find((request: any) => {
      return request.id === id;
    });

    if (request) {
      const schema = generateJsonSchema(request.invocations[0].body);
      setSchema(schema);
      const curlCommand = generateCurlCommand(request);
      setCurl(curlCommand);
      setTypescript(jsonSchemaToTypescriptInterface(schema, "body"));
      setRequest(request);
    }
  }, [id, requests]);

  const handleTabChanged = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleExecuteClicked = (
    url: string,
    method: string,
    invocation: any
  ) => {
    executeRequest(url, method, invocation);
  };

  return (
    <div className={styles.requestPageContainer}>
      {request === undefined && "No request found"}
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
          <Card>
            <div className={styles.cardTitle}>
              <Typography variant="h6">Invocations</Typography>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>execute</TableCell>
                  <TableCell>service</TableCell>
                  <TableCell>request id</TableCell>
                  <TableCell>timestamp</TableCell>
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
                      <TableCell>{request.service}</TableCell>
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
            <Tabs value={tab} onChange={handleTabChanged}>
              <Tab label="cUrl" value={0}></Tab>
              <Tab label="Typescript" value={1}></Tab>
              <Tab label="JSON Schema" value={2}></Tab>
              <Tab label="RAW" value={3}></Tab>
            </Tabs>
            <TabContent index={0} tabValue={tab}>
              <div className={styles.cardTitle}>
                <pre>{curl}</pre>
              </div>
            </TabContent>
            <TabContent index={1} tabValue={tab}>
              <div className={styles.cardTitle}>
                <pre>
                  <pre>{typescript}</pre>
                </pre>
              </div>
            </TabContent>
            <TabContent index={2} tabValue={tab}>
              <div className={styles.cardTitle}>
                <pre>{JSON.stringify(schema, null, 2)}</pre>
              </div>
            </TabContent>
            <TabContent index={3} tabValue={tab}>
              <>
                <div className={styles.cardTitle}></div>
                <pre>{JSON.stringify(request, null, 2)}</pre>
              </>
            </TabContent>
          </Card>
        </>
      )}
    </div>
  );
};

const TabContent: React.FC<
  {
    index: number;
    tabValue: number;
  } & PropsWithChildren
> = ({ children, index, tabValue }) => {
  return <>{index === tabValue && children}</>;
};
