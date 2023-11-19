import * as React from "react";
import { useParams } from "react-router-dom";
import { BackendAxios } from "../../api/backendAxios";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ExecutionRow } from "./ExecutionRowProps";

export const ExecutionHistory = () => {
  const { testSuiteId, testId } = useParams();
  const [executions, setExecutions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  console.log(executions);

  React.useEffect(() => {
    if (!testSuiteId || !testId) {
      return;
    }
    setLoading(true);
    setExecutions([]);
    BackendAxios.get(
      `/test-suites/${testSuiteId}/tests/${testId}/test-executions`
    )
      .then((res) => {
        setExecutions(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [testSuiteId, testId]);

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
          {executions.map((i) => (
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
              key={i}
              checks={i.checks}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
