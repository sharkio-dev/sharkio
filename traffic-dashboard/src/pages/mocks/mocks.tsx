import { AddBox } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { activateMock, deactivateMock, getAllMocks } from "../../api/api";
import { HttpMethod } from "../../components/http-method/http-method";
import { HttpStatus } from "../../components/http-status/http-status";
import { AddMockDialog } from "./add-mock-dialog/add-mock.dialog";
import styles from "./mocks.module.scss";

type Mock = {
  method: string;
  endpoint: string;
  data: any;
  active: boolean;
  id: string;
  status: number;
};

type Service = {
  name: string;
  port: number;
};

type ServiceMock = {
  service: Service;
  mocks: Mock[];
};

const Mocks = () => {
  const [mocks, setMocks] = useState<ServiceMock[]>([]);
  const [addOpen, setAddOpen] = useState<boolean>(false);

  const loadData = () => {
    getAllMocks().then((res) => setMocks(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddClicked = () => {
    setAddOpen(true);
  };

  const handleCloseModal = () => {
    setAddOpen(false);
    loadData();
  };

  return (
    <>
      <Button onClick={handleAddClicked}>
        <AddBox />
        &nbsp;&nbsp;add
      </Button>
      <Card>
        {mocks.flatMap((serviceMock: ServiceMock) => {
          return serviceMock.mocks.map((mock: Mock) => {
            return (
              <MockRow
                mock={mock}
                service={serviceMock.service}
                loadData={loadData}
              />
            );
          });
        })}
      </Card>
      <AddMockDialog open={addOpen} close={handleCloseModal} />
    </>
  );
};

const MockRow: React.FC<{
  mock: Mock;
  service: Service;
  loadData: () => void;
}> = ({ mock, service, loadData }) => {
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
          expandIcon={<ExpandMoreIcon />}
        >
          <div className={styles.mockTitle}>
            <Switch
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleSwitchClicked(
                  (e.target.value === "true" && true) ||
                    (e.target.value === "false" && false)
                );
              }}
              checked={mock.active}
            />
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

export default Mocks;
