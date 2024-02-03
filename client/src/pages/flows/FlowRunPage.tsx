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
import { useNavigate, useParams } from "react-router-dom";
import { useFlowStore } from "../../stores/flowStore";
import { useEffect, useState } from "react";
import { GoBackButton } from "./FlowStepPage";

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
  const [run, setRun] =
    useState<
      { name: string; assertionsResult: { passed: Check[]; failed: Check[] } }[]
    >();
  const navigate = useNavigate();

  useEffect(() => {
    if (!flowId || !runId) return;
    loadRun(flowId, runId, true).then((run) => {
      setRun(run);
    });
  }, [flowId, runId]);

  if (!run) return null;

  return (
    <div className="flex flex-col p-4 space-y-2">
      <GoBackButton onClick={() => navigate(-1)} />
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
              const passed = r.assertionsResult.passed;
              const failed = r.assertionsResult.failed;
              const checks = passed.concat(failed);
              return (
                <ExecutionRow
                  title={r.name}
                  status={
                    checks.every((check: any) => check.isPassed)
                      ? "success"
                      : "failure"
                  }
                  executionDate={"GET /test"}
                  passed={passed.length}
                  failed={failed.length}
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
