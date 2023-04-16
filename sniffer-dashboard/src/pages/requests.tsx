import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Chip,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./requests.module.css";
import { Edit, PlayCircle, PlayCircleFilled } from "@mui/icons-material";
import { useRouter } from "next/router";

type PathData = {
  method: string;
  hitCount: number;
  invocations: Invocation[];
};

export type Invocation = {
  id: string;
  timestamp: Date;
  body?: any;
  headers?: any;
  cookies?: any;
  params?: any;
};

export default function Home() {
  const [data, setData] = useState<PathData[]>([]);
  const router = useRouter();

  const refreshData = () => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setData(data));
  };

  useEffect(() => {
    refreshData();
  }, []);

  const RequestProperty: React.FC<{ propertyName: string; data: any }> = ({
    propertyName,
    data,
  }) => {
    return (
      <Accordion key={propertyName}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {propertyName}
        </AccordionSummary>
        <AccordionDetails>
          <pre>{JSON.stringify(data[propertyName], null, 2)}</pre>
        </AccordionDetails>
      </Accordion>
    );
  };

  const RequestConfigEditor: React.FC<{ propertyName: string; data: any }> = ({
    propertyName,
    data,
  }) => {
    return (
      <Accordion key={propertyName}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {propertyName}
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {Object.keys(data).map((configKey: string) => {
              return (
                <ListItemButton key={configKey}>
                  <ListItemText>{configKey}</ListItemText>
                  <ListItemText>{JSON.stringify(data[configKey])}</ListItemText>
                </ListItemButton>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  };

  const InvocationsCard: React.FC<{
    url: string;
    method: string;
    propertyName: string;
    invocations: any;
  }> = ({ url, method, propertyName, invocations }) => {
    return (
      <Accordion key={propertyName}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {propertyName}
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.invocationsTable}>
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(invocations[0]).map((property) => (
                    <TableCell key={property}>{property}</TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invocations.map((invocation: any, index: number) => {
                  const router = useRouter();

                  async function execute() {
                    await fetch("/api/execute", {
                      method: "post",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        invocation,
                        url,
                        method,
                      }),
                    });
                  }

                  async function saveRequest(invocation: Invocation) {
                    router.push(
                      {
                        pathname: `/request`,
                        query: {
                          data: JSON.stringify({ invocation, url, method }),
                        },
                      },
                      "/request"
                    );
                  }

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <IconButton onClick={execute}><PlayCircle></PlayCircle></IconButton>
                        <IconButton onClick={edit}><Edit></Edit></IconButton>
                      </TableCell>
                      {Object.keys(invocation).map((key: string) => {
                        return (
                          <TableCell key={key}>
                            {JSON.stringify(invocation[key])}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <Button onClick={execute}>Execute</Button>
                        <Button
                          onClick={() => {
                            saveRequest(invocation, url, method);
                          }}
                        >
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </AccordionDetails>
      </Accordion>
    );
  };

  const RequestCard: React.FC<{
    url: string;
    hitCount: number;
    method: string;
  }> = (request) => {
    const { url, hitCount, method } = request;
    return (
      <Accordion key={url}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className={styles.accordionContentContainer}>
            <Chip color="primary" label={hitCount} />
            <Chip color="success" label={method} variant="outlined"></Chip>
            <Typography>{url}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          {Object.keys(request).map((key: string) => {
            switch (key) {
              case "config":
                return (
                  <RequestConfigEditor propertyName={key} data={request[key]} />
                );
              case "invocations":
                return (
                  <InvocationsCard
                    url={url}
                    method={method}
                    propertyName={key}
                    invocations={request[key]}
                  />
                );
              default:
                return <RequestProperty propertyName={key} data={request} />;
            }
          })}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Card className={styles.requestsContainer}>
      <Button onClick={() => refreshData()}>Refresh</Button>
      <div className={styles.requestCards}>
        {Object.keys(data)
          .flatMap((path: string) => {
            return Object.keys(data[path]).map((method: string) => {
              return { ...data[path][method], url: path };
            });
          })
          .map((request) => (
            <RequestCard key={request} {...request} />
          ))}
      </div>
    </Card>
  );
}
