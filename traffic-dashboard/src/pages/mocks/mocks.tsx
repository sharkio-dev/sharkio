import { AddBox } from "@mui/icons-material";
import { Button, Card } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllMocks } from "../../api/api";
import MockRow from "../../components/mock/mock-row";
import { AddMockDialog } from "./add-mock-dialog/add-mock.dialog";
import { Mock, ServiceMock } from "../../types/types";

const MocksPage = () => {
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
                editable={true}
              />
            );
          });
        })}
      </Card>
      <AddMockDialog open={addOpen} close={handleCloseModal} />
    </>
  );
};

export default MocksPage;
