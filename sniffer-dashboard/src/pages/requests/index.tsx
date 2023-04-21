import { Edit, PlayCircle } from "@mui/icons-material";
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
import { execute } from "@/api/requests";
import { PathData } from "@/types/types";

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
    const router = useRouter();
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
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            execute(invocation, url, method);
                          }}
                        >
                          <PlayCircle></PlayCircle>
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            router.push("/request/" + invocation.id);
                          }}
                        >
                          <Edit></Edit>
                        </IconButton>
                      </TableCell>
                      {Object.keys(invocation).map((key: string) => {
                        return (
                          <TableCell key={key}>
                            {JSON.stringify(invocation[key])}
                          </TableCell>
                        );
                      })}
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
  }> = (request: any) => {
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

  const executeSampleRequest = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Cookie",
      "pc_sess=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJydW5EZWJ0SWQiOiI4YmYyYTFjZC02ODhiLTQ3NDEtOTI4MS02NDZlNDI4NzAwZTYiLCJpYXQiOjE2NzkzMTEyMTMsImV4cCI6MTY3OTMxMzAxM30.D6dqo4a7DRPa8JClLGtwxBH7-3ecYR6kt34OcQFWrbs"
    );

    var raw = JSON.stringify({
      login: "my_login",
      password: "my_password",
    });

    var requestOptions: any = {
      invocation: {
        headers: myHeaders,
        body: raw,
      },
      method: "POST",
      url: "/sample",
    };

    execute(requestOptions)
      .then((result) => console.log("success"))
      .catch((error) => console.log("error", error));
  };

  return (
    <Card className={styles.requestsContainer}>
      <Button onClick={() => refreshData()}>Refresh</Button>
      <Button onClick={() => executeSampleRequest()}>Sample</Button>
      <div className={styles.requestCards}>
        {Object.keys(data)
          .flatMap((path: string) => {
            return Object.keys(data[path]).map((method: string) => {
              return { ...data[path][method], url: path };
            });
          })
          .map((request, index) => (
            <RequestCard key={`${request}${index}`} {...request} />
          ))}
      </div>
    </Card>
  );
}
