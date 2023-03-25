import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary, Button,
  Card,
  Chip, Typography
} from "@mui/material";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "./requests.module.scss";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  const refreshData = () => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setData(data));
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <Card className={styles.requestsContainer}>
      <Button onClick={() => refreshData()}>Refresh</Button>
      <div className={styles.requestCards}>
        {data &&
          Object.keys(data).map((request: string) => (
            <Accordion key={request}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className={styles.accordionContentContainer}>
                  {/* <KeyboardArrowDownIcon></KeyboardArrowDownIcon> */}
                  <Chip color="primary" label={data[request].hitCount} />
                  <Chip
                    color="success"
                    label={data[request].method}
                    variant="outlined"
                  ></Chip>
                  <Typography>{request}</Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Button fullWidth color="success">
                  execute
                </Button>
                <pre>hitCount:{data[request].hitCount}</pre>
              </AccordionDetails>
            </Accordion>
          ))}
      </div>
    </Card>
  );
}
