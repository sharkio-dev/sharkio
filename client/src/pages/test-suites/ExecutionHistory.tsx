import * as React from "react";
import { useParams } from "react-router-dom";
import { LoadingIcon } from "../sniffers/loadingIcon";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ExecutionRow } from "./ExecutionRowProps";
import { useTestStore } from "../../stores/testStore";

export const ExecutionHistory = () => {
  const { testSuiteId, testId, endpointId } = useParams();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { getExecutions, executions, getExecutionByEndpoint, tests } =
    useTestStore();

  React.useEffect(() => {
    if (testSuiteId && endpointId && !testId) {
      setLoading(true);
      const url = Object.keys(tests)[+endpointId];
      getExecutionByEndpoint(testSuiteId, url).finally(() => {
        setLoading(false);
      });
      return;
    }
    if (!testSuiteId || !testId) {
      return;
    }
    setLoading(true);

    getExecutions(testSuiteId, testId).finally(() => {
      setLoading(false);
    });
  }, [testSuiteId, testId, endpointId]);

  return (
    <TableContainer className="border-[1px] border-primary rounded-lg">
      <Table>
        <TableHead>
          <TableRow className="bg-secondary">
            <TableCell style={{ borderBottom: "none" }}>
              {executions.length} executions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell>
                <div className="flex flex-row items-center justify-center">
                  <LoadingIcon />
                </div>
              </TableCell>
            </TableRow>
          )}
          {executions.map((i, index) => (
            <ExecutionRow
              title={i.request.method + " " + i.request.url}
              status={
                i.checks.every((check: any) => check.isPassed)
                  ? "success"
                  : "failure"
              }
              executionDate={i.testExecution.createdAt}
              passed={i.checks.filter((check: any) => check.isPassed).length}
              failed={i.checks.filter((check: any) => !check.isPassed).length}
              key={index}
              checks={i.checks}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
