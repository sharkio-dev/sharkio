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
  const [runs, setRuns] =
    useState<
      { name: string; assertionsResult: { passed: Check[]; failed: Check[] } }[]
    >();
  const navigate = useNavigate();

  useEffect(() => {
    if (!flowId || !runId) return;
    loadRun(flowId, runId, true).then((run) => {
      setRuns(run);
    });
  }, [flowId, runId]);

  if (!runs) return null;

  return (
    <div className="flex flex-col p-4 space-y-2">
      <GoBackButton onClick={() => navigate(-1)} />
      <TableContainer className="border-[1px] border-primary rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-secondary">
              <TableCell style={{ borderBottom: "none" }}>
                {runs.length} executions
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
            {runs.map((run, index) => {
              const passed = run.assertionsResult.passed ?? [];
              const failed = run.assertionsResult.failed ?? [];
              const checks = passed.concat(failed);
              return (
                <ExecutionRow
                  title={run.name}
                  status={run.status}
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
