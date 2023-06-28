import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Switch,
  ToggleButton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HttpMethod } from "../../components/http-method/http-method";
import styles from "./mocks.module.scss";

const Mocks = () => {
  return (
    <>
      <Button> add</Button>
      <Card>
        <Accordion>
          <AccordionSummary
            aria-controls="panel2d-content"
            id="panel2d-header"
            expandIcon={<ExpandMoreIcon />}
          >
            <div className={styles.mockTitle}>
              <Switch onClick={(e) => e.stopPropagation()}></Switch>
              <HttpMethod method={"GET"}></HttpMethod>
              <Typography>/hello</Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <pre>{JSON.stringify({ hello: "world" }, null, 2)}</pre>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Card>
    </>
  );
};

export default Mocks;
