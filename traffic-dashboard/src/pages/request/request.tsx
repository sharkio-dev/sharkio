import { PlayArrow } from '@mui/icons-material';
import {
  Button,
  Card,
  CircularProgress,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { executeRequest } from '../../api/api';
import { HttpMethod } from '../../components/http-method/http-method';
import { RequestsMetadataContext } from '../../context/requests-context';
import {
  JsonObject,
  JsonSchema,
  generateCurlCommand,
  generateJsonSchema,
  jsonSchemaToTypescriptInterface,
} from '../../lib/jsonSchema';
import { JsonToOpenapi } from '../../lib/generateOpenapi';
import styles from './requestCard.module.scss';
import {
  InterceptedRequest,
  Invocation,
  SnifferConfig,
} from '../../types/types';
import { OpenAPIDocument } from '../../lib/openapi.interface';

export const RequestPage: React.FC = () => {
  const { id, serviceId } = useParams();
  const [typescript, setTypescript] = useState<string | undefined>(undefined);
  const [openapi, setOpenapi] = useState<OpenAPIDocument | undefined>(
    undefined,
  );
  const [curl, setCurl] = useState<string | undefined>(undefined);
  const [schema, setSchema] = useState<JsonSchema | undefined>(undefined);
  const [request, setRequest] = useState<InterceptedRequest | undefined>(
    undefined,
  );
  const [tab, setTab] = useState(0);
  const {
    loadData,
    requestsData: requests,
    servicesData: services,
  } = useContext(RequestsMetadataContext);
  const service = services?.find((service) => service.id === serviceId);

  useEffect(() => {
    loadData?.();
  }, []);

  useEffect(() => {
    console.log(requests);
    const request = requests?.find((request) => {
      return request.id === id;
    });

    if (request) {
      const schema = generateJsonSchema(
        request.invocations[0].body as JsonObject,
      );
      setSchema(schema);
      const curlCommand = generateCurlCommand(request);
      setCurl(curlCommand);
      setTypescript(jsonSchemaToTypescriptInterface(schema, 'body'));
      setOpenapi(JsonToOpenapi(new Array(request), request.serviceId, '1.0.0'));
      setRequest(request);
    }
  }, [id, requests]);

  const handleTabChanged = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <div className={styles.requestPageContainer}>
      {request === undefined && 'No request found'}
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
            <Tabs value={tab} onChange={handleTabChanged}>
              <Tab label="cUrl" value={0}></Tab>
              <Tab label="Typescript" value={1}></Tab>
              <Tab label="JSON Schema" value={2}></Tab>
              <Tab label="RAW" value={3}></Tab>
              <Tab label="openAPI" value={4}></Tab>
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
              <div className={styles.cardTitle}>
                <pre>{JSON.stringify(request, null, 2)}</pre>
              </div>
            </TabContent>
            <TabContent index={4} tabValue={tab}>
              <div className={styles.cardTitle}>
                <pre>{JSON.stringify(openapi, null, 2)}</pre>
              </div>
            </TabContent>
          </Card>
          <Card className={styles.invocationsCardContainer}>
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
                {' '}
                {request.invocations.map((invocation) => {
                  return (
                    <InvocationRow
                      key={invocation.id}
                      service={service}
                      invocation={invocation}
                      request={request}
                    />
                  );
                })}
              </TableBody>
            </Table>
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
interface InvocationRowProps {
  invocation: Invocation;
  service?: SnifferConfig;
  request: any;
}

const InvocationRow: React.FC<InvocationRowProps> = ({
  invocation,
  service,
  request,
}) => {
  const [executeLoading, setExecuteLoading] = useState(false);

  const handleExecuteClicked = (
    url: string,
    method: string,
    invocation: Invocation,
  ) => {
    if (!service?.port) {
      console.error('service was not found for requests');
      return;
    }
    setExecuteLoading(true);
    executeRequest(service?.port, url, method, invocation).finally(() =>
      setExecuteLoading(false),
    );
  };

  return (
    <>
      <TableRow key={invocation.id}>
        <TableCell>
          <Button
            onClick={() => {
              handleExecuteClicked(
                'http://localhost:' + `${service?.port}` + `${request.url}`,
                request.method,
                invocation,
              );
            }}
          >
            {executeLoading ? (
              <CircularProgress />
            ) : (
              <PlayArrow color="success"></PlayArrow>
            )}
          </Button>
        </TableCell>
        <TableCell>{service?.name ?? ''}</TableCell>
        <TableCell>{invocation.id}</TableCell>
        <TableCell>{invocation.timestamp}</TableCell>
        <TableCell>{JSON.stringify(invocation.body)}</TableCell>
        <TableCell>{JSON.stringify(invocation.params)}</TableCell>
        <TableCell>{JSON.stringify(invocation.headers)}</TableCell>
      </TableRow>
    </>
  );
};
