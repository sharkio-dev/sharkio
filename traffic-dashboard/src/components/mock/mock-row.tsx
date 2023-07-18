import {
  Accordion,
  AccordionSummary,
  Switch,
  Typography,
  AccordionDetails,
  TextField,
} from "@mui/material";
import { activateMock, deactivateMock } from "../../api/api";
import { Mock, Service } from "../../types/types";
import { HttpMethod } from "../http-method/http-method";
import { HttpStatus } from "../http-status/http-status";
import styles from "./mock-row.module.scss";
import { ExpandMore } from "@mui/icons-material";

const MockRow: React.FC<{
  mock: Mock;
  service: Service;
  editable: boolean;
  loadData: () => void;
}> = ({ mock, service, editable=false, loadData }) => {
  const toggleActive = (newValue: boolean) => {
    return newValue === true
      ? activateMock(service.port, mock.method, mock.endpoint)
      : deactivateMock(service.port, mock.method, mock.endpoint);
  };

  const handleSwitchClicked = (value: boolean) => {
    toggleActive(value).finally(() => {
      loadData();
    });
  };

  return (
    <>
      <Accordion>
        <AccordionSummary
          aria-controls="panel2d-content"
          id="panel2d-header"
          expandIcon={<ExpandMore />}
        >
          <div className={styles.mockTitle}>
            {editable && (
              <Switch
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleSwitchClicked(
                    e.target.checked && true || false
                  );
                }}
                checked={mock.active}
              />
            )}
            <HttpMethod method={mock.method}></HttpMethod>
            <HttpStatus status={mock.status} />
            <Typography>{mock.endpoint}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            className={styles.dataContainer}
            label="Data"
            placeholder="{}"
            multiline
            rows={5}
            value={mock.data}
            contentEditable={false}
            disabled={true}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default MockRow;
