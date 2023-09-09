import {
  ContentCopy,
  FolderCopyOutlined,
  PlayArrow,
} from "@mui/icons-material";
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
  TextField,
  Typography,
} from "@mui/material";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { executeRequest, saveRequestToCollection } from "../../api/api";
import { HttpMethod } from "../../components/http-method/http-method";
import { useSnackbar } from "../../hooks/useSnackbar";
import { JsonToOpenapi } from "../../lib/generateOpenapi";
import {
  JsonObject,
  JsonSchema,
  generateCurlCommand,
  generateJsonSchema,
  jsonSchemaToTypescriptInterface,
  generateApiRequestSnippet,
} from "../../lib/jsonSchema";
import { OpenAPIDocument } from "../../lib/openapi.interface";
import {
  Collection,
  InterceptedRequest,
  Invocation,
  SnifferConfig,
} from "../../types/types";
import { CollectionPickerModal } from "../collections-picker-modal/collection-picker-modal";
import styles from "./requestCard.module.scss";
import copy from "copy-to-clipboard";

interface IRequestPageProps {
  service: SnifferConfig;
  request: InterceptedRequest;
}

export const RequestPage: React.FC<IRequestPageProps> = ({
  request,
  service,
}) => {
  const [selectCollectionDialogOpen, setSelectCollectionDialogOpen] =
    useState(false);
  const [typescript, setTypescript] = useState<string | undefined>(undefined);
  const [openapi, setOpenapi] = useState<OpenAPIDocument | undefined>(
    undefined,
  );

  const [jsFetch, setJsfetch] = useState<string | undefined>(undefined);
  const [phpGuzzle, setPhpGuzzle] = useState<string | undefined>(undefined);
  const [pythonRequest, setPythonRequest] = useState<string | undefined>(
    undefined,
  );
  const [javaOkHttp, setJavaOkHttp] = useState<string | undefined>(undefined);
  const [golang, setGolang] = useState<string | undefined>(undefined);
  const [curl, setCurl] = useState<string | undefined>(undefined);
  const [schema, setSchema] = useState<JsonSchema | undefined>(undefined);
  const [tab, setTab] = useState(0);
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  useEffect(() => {
    if (request) {
      const schema = generateJsonSchema(
        request.invocations[0].body as JsonObject,
      );
      setSchema(schema);
      const curlCommand = generateCurlCommand(request);

      let headers: JsonObject = {
        authorization: request.invocations[0].headers.authorization,
        accept: request.invocations[0].headers.accept,
        "cache-control": request.invocations[0].headers["cache-control"],
        connection: request.invocations[0].headers["connection"],
      };
      headers = removeNullUndefinedFromObject(headers);
      const url = `http://${request.invocations[0].headers.host}${request.url}`;

      const javascriptSnippet = generateApiRequestSnippet(
        "javascript",
        request.method,
        url,
        headers,
        request.invocations[0].body,
        request.invocations[0].params,
      );
      setJsfetch(javascriptSnippet);

      const phpScript = generateApiRequestSnippet(
        "php",
        request.method,
        url,
        headers,
        request.invocations[0].body,
        request.invocations[0].params,
      );
      setPhpGuzzle(phpScript);

      const pythonScript = generateApiRequestSnippet(
        "python",
        request.method,
        url,
        headers,
        request.invocations[0].body,
        request.invocations[0].params,
      );
      setPythonRequest(pythonScript);

      const javaSnippet = generateApiRequestSnippet(
        "java",
        request.method,
        url,
        headers,
        request.invocations[0].body,
        request.invocations[0].params,
      );
      setJavaOkHttp(javaSnippet);

      const goLangSnippet = generateApiRequestSnippet(
        "golang",
        request.method,
        url,
        headers,
        request.invocations[0].body,
        request.invocations[0].params,
      );
      setGolang(goLangSnippet);

      setCurl(curlCommand);
      setTypescript(jsonSchemaToTypescriptInterface(schema, "body"));
      setOpenapi(JsonToOpenapi(new Array(request), request.serviceId, "1.0.0"));
    }
  }, [request]);

  const handleTabChanged = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleSaveClicked = (collectionId: Collection["id"]) => {
    saveRequestToCollection(collectionId, request)
      .then(() => {
        showSnackbar("successfully saved", "success");
      })
      .catch(() => {
        showSnackbar("failed to save", "error");
      });
  };
  const tabsContent = [
    curl,
    typescript,
    JSON.stringify(schema, null, 2),
    JSON.stringify(request, null, 2),
    JSON.stringify(openapi, null, 2),
    jsFetch,
    pythonRequest,
    javaOkHttp,
    golang,
    phpGuzzle,
  ].map((content, index) => {
    const handleCopyClicked = () => {
      copy(content ?? "");
    };

    return (
      <TabContent key={index} index={index} tabValue={tab}>
        <div className="flex flex-col gap-5 pt-5">
          <TextField
            className={"w-full"}
            label="Data"
            placeholder="{}"
            multiline
            rows={10}
            defaultValue={content}
            disabled={true}
          />
          <Button onClick={handleCopyClicked}>
            <div>
              <ContentCopy />
              copy
            </div>
          </Button>
        </div>
      </TabContent>
    );
  });

  return (
    <div className={styles.requestPageContainer}>
      <CollectionPickerModal
        open={selectCollectionDialogOpen}
        onClose={() => {
          setSelectCollectionDialogOpen(false);
        }}
        onChoose={function (collectionId: string): void {
          handleSaveClicked(collectionId);
          setSelectCollectionDialogOpen(false);
        }}
      />
      {snackBar}
      {request === undefined && "No request found"}
      {request && (
        <>
          <Card className={"flex flex-col p-10"}>
            <div className={"flex flex-row justify-between pt-15px mb-4"}>
              <Typography variant="h6" className="flex gap-3">
                <HttpMethod method={request.method} />
                {request.url}
              </Typography>
              <Button
                onClick={() => {
                  setSelectCollectionDialogOpen(true);
                }}
              >
                <div className="flex gap-3">
                  <FolderCopyOutlined />
                  <Typography>save in collection</Typography>
                </div>
              </Button>
            </div>
            <div className="grid grid-cols-2 grid w-fit">
              <Typography>hit count: </Typography>
              <Typography>{request.hitCount}</Typography>
              <Typography>last invocation:</Typography>
              <Typography>{request.lastInvocationDate}</Typography>
              <Typography>service:</Typography>
              <Typography>{service.name}</Typography>
            </div>
          </Card>
          <Card>
            <Tabs
              value={tab}
              onChange={handleTabChanged}
              visibleScrollbar={true}
            >
              <Tab label="cUrl" value={0}></Tab>
              <Tab label="Typescript" value={1}></Tab>
              <Tab label="JSON Schema" value={2}></Tab>
              <Tab label="RAW" value={3}></Tab>
              <Tab label="openAPI" value={4}></Tab>
              <Tab label="javascript" value={5}></Tab>
              <Tab label="python" value={6}></Tab>
              <Tab label="java" value={7}></Tab>
              <Tab label="golang" value={8}></Tab>
              <Tab label="php" value={9}></Tab>
            </Tabs>
            {tabsContent}
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
                {" "}
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
      console.error("service was not found for requests");
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
              handleExecuteClicked(request.url, request.method, invocation);
            }}
          >
            {executeLoading ? (
              <CircularProgress />
            ) : (
              <PlayArrow color="success"></PlayArrow>
            )}
          </Button>
        </TableCell>
        <TableCell>{service?.name ?? ""}</TableCell>
        <TableCell>{invocation.id}</TableCell>
        <TableCell>{invocation.timestamp}</TableCell>
        <TableCell>{JSON.stringify(invocation.body)}</TableCell>
        <TableCell>{JSON.stringify(invocation.params)}</TableCell>
        <TableCell>{JSON.stringify(invocation.headers)}</TableCell>
      </TableRow>
    </>
  );
};

const removeNullUndefinedFromObject = (obj: JsonObject) => {
  return Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== undefined)
    .reduce((result: any, key: any) => {
      result[key] = obj[key];
      return result;
    }, {});
};
