import { LoadingIcon } from "../sniffers/LoadingIcon";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ExecutionRow } from "../test-suites/ExecutionRowProps";
import { useParams } from "react-router-dom";
import { useFlowStore } from "../../stores/flowStore";
import { useEffect, useState } from "react";

interface Check {
  actualValue: string;
  comparator: "eq" | "neq" | "contains" | "not_contains";
  expectedValue: string;
  isPassed: boolean;
  targetPath: string;
  type: "status_code" | "body" | "header";
}

export const FlowRunPage = () => {
  const { loadRun, isRunLoading } = useFlowStore();
  const { runId, flowId } = useParams();
  const [run, setRun] = useState<{ name: string; checks: Check[] }[]>();

  useEffect(() => {
    if (!flowId || !runId) return;
    loadRun(flowId, runId).then((run) => {
      console.log("run", run);
      setRun(run);
    });
  }, [flowId, runId]);

  if (!run) return null;

  return (
    <div className="flex flex-col p-4">
      <TableContainer className="border-[1px] border-primary rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-secondary">
              <TableCell style={{ borderBottom: "none" }}>
                {run.length} executions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isRunLoading && (
              <TableRow>
                <TableCell>
                  <div className="flex flex-row items-center justify-center">
                    <LoadingIcon />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {run.map((r, index) => {
              const checks = r.checks || [];
              return (
                <ExecutionRow
                  title={r.name}
                  status={
                    checks.every((check: any) => check.isPassed)
                      ? "success"
                      : "failure"
                  }
                  executionDate={"GET /test"}
                  passed={checks.filter((check: any) => check.isPassed).length}
                  failed={checks.filter((check: any) => !check.isPassed).length}
                  key={index}
                  checks={checks}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
