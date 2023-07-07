import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Dialog,
  Input,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllMocks } from "../../api/api";
import { HttpMethod } from "../../components/http-method/http-method";
import styles from "./mocks.module.scss";
import { AddMockDialog } from "./add-mock-dialog/add-mock.dialog";

type Mock = {
  method: string;
  endpoint: string;
  data: any;
  active: boolean;
  id: string;
};

type Service = {
  name: string;
  port: number;
};

type ServiceMocks = {
  service: Service;
  mocks: Mock[];
};

const Mocks = () => {
  const [mocks, setMocks] = useState<ServiceMocks[]>([]);
  const [addOpen, setAddOpen] = useState<boolean>(false);

  useEffect(() => {
    getAllMocks().then((res) => setMocks(res.data));
  }, []);

  const handleAddClicked = () => {
    setAddOpen(true);
  };
  const handleCloseModal = () => {
    setAddOpen(false);
  };

  return (
    <>
      <Button onClick={handleAddClicked}> add</Button>
      <Card>
        {mocks.flatMap((serviceMocks) => {
          return serviceMocks.mocks.map((mock: Mock) => {
            return <MockRow mock={mock} />;
          });
        })}
      </Card>
      <AddMockDialog open={addOpen} close={handleCloseModal} />
    </>
  );
};

const MockRow: React.FC<{ mock: Mock }> = ({ mock }) => {
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
              onClick={(e) => e.stopPropagation()}
              value={mock.active}
            ></Switch>
            <HttpMethod method={mock.method}></HttpMethod>
            <Typography>{mock.endpoint}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <pre>{JSON.stringify(mock.data, null, 2)}</pre>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default Mocks;
