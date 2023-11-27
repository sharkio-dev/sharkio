import * as React from "react";
import {
  AiOutlineDelete,
  AiOutlinePlayCircle,
  AiOutlinePlus,
} from "react-icons/ai";
import clsx from "clsx";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, useTreeItem } from "@mui/x-tree-view/TreeItem";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { TestType, useTestStore } from "../../stores/testStore";
import { AddTestModal } from "./AddTestModal";
import { LoadingIcon } from "../sniffers/LoadingIcon";

type CustomContentProps = {
  onExecute?: () => Promise<void>;
  type: "endpoint" | "test";
  childrenIds?: string[];
  endpointId?: string;
  onDelete?: () => void;
  className?: string;
  label?: React.ReactNode;
  nodeId: string;
  icon?: React.ReactNode;
  expansionIcon?: React.ReactNode;
  displayIcon?: React.ReactNode;
  classes: {
    root: string;
    expanded: string;
    selected: string;
    focused: string;
    disabled: string;
    iconContainer: string;
    label: string;
  };
};
function CustomContent(props: CustomContentProps, ref: React.Ref<any>) {
  const {
    childrenIds,
    endpointId,
    onExecute,
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    type,
    onDelete,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);
  const [addTestModalOpen, setAddTestModalOpen] =
    React.useState<boolean>(false);
  const [isDeleteClicked, setIsDeleteClicked] = React.useState<boolean>(false);
  const navigator = useNavigate();
  const { testSuiteId } = useParams();
  const ref1 = React.useRef<any>(null);
  const { executedTests, getExecutionByEndpoint, getExecutions } =
    useTestStore();

  const handleDeleteClick = () => {
    if (isDeleteClicked) {
      onDelete && onDelete();
    }
    setIsDeleteClicked(true);
  };

  React.useEffect(() => {
    if (!selected) {
      setIsDeleteClicked(false);
    }
  }, [selected]);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event: any) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event: any) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event: any, isManual: boolean) => {
    if (type === "test" && isManual) {
      navigator(
        "/test-suites/" +
          testSuiteId +
          "/endpoints/" +
          endpointId +
          "/tests/" +
          nodeId,
      );
    } else if (type === "endpoint" && isManual) {
      navigator("/test-suites/" + testSuiteId + "/endpoints/" + endpointId);
    }
    handleSelection(event);
  };

  const onClickPlay = () => {
    if (onExecute) {
      onExecute().then(() => {
        if (type === "test") {
          getExecutions(testSuiteId as string, nodeId as string);
        } else if (type === "endpoint") {
          getExecutionByEndpoint(testSuiteId as string, label as string);
        }
      });
    }
  };

  const isLoading =
    type === "test"
      ? executedTests[nodeId]
      : (childrenIds || []).some((id) => executedTests[id]);

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={(event: any) => handleSelectionClick(event, true)}
        component="div"
        className={classes.label}
        ref={ref1}
      >
        {label}
      </Typography>
      <div className="flex flex-row items-center space-x-2 px-2">
        {handleDeleteClick && (
          <AiOutlineDelete
            className={`text-[#fff] text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100 ${
              isDeleteClicked && "text-red-500"
            }`}
            onClick={handleDeleteClick}
          />
        )}
        {type === "endpoint" && (
          <AiOutlinePlus
            className="text-[#fff] text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100"
            onClick={() => setAddTestModalOpen(true)}
          />
        )}
        {onClickPlay &&
          (!isLoading ? (
            <AiOutlinePlayCircle
              className="text-green-400 text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100"
              onClick={onClickPlay}
            />
          ) : (
            <LoadingIcon />
          ))}
      </div>
      <AddTestModal
        open={addTestModalOpen}
        onClose={() => setAddTestModalOpen(false)}
      />
    </div>
  );
}

const CustomContentRef = React.forwardRef(CustomContent);

type CustomTreeItemProps = {
  childrenIds?: string[];
  onExecute?: () => Promise<void>;
  endpointId?: string;
  type: "endpoint" | "test";
  onDelete?: () => void;
  nodeId: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  expansionIcon?: React.ReactNode;
  displayIcon?: React.ReactNode;
  children?: React.ReactNode;
};
const CustomTreeItemRef = (props: CustomTreeItemProps, ref: React.Ref<any>) => {
  return (
    <TreeItem
      ContentComponent={(p: any) => <CustomContentRef {...props} {...p} />}
      {...props}
      ref={ref}
    />
  );
};

const CustomTreeItem = React.forwardRef(CustomTreeItemRef);

export function TestTree() {
  const { testSuiteId } = useParams();
  const [testModalOpen, setTestModalOpen] = React.useState<boolean>(false);
  const { show, component: snackBar } = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { executeTest, loadTests, deleteTest, tests, resetTests } =
    useTestStore();
  const navigator = useNavigate();

  const fetchTestTree = () => {
    if (!testSuiteId) {
      resetTests();
      return;
    }
    setLoading(true);
    loadTests(testSuiteId).finally(() => {
      setLoading(false);
    });
  };

  React.useEffect(() => {
    fetchTestTree();
  }, [testSuiteId]);

  const onDeleteClicked = (testId: string) => {
    if (!testSuiteId || !testId) {
      return;
    }

    deleteTest(testSuiteId as string, testId)
      .then(() => {
        show("Test deleted successfully", "success");
        fetchTestTree();
      })
      .catch(() => {
        show("Failed to delete test", "error");
      });
  };

  const execute = (testId: string) => {
    return executeTest(testSuiteId as string, testId)
      .then(() => {
        show("Test executed successfully", "success");
      })
      .catch(() => {
        show("Failed to execute test", "error");
      });
  };

  return (
    <>
      {Object.keys(tests).length === 0 && !loading && (
        <div className="flex flex-col h-full justify-center items-center ">
          <div
            className="flex flex-row items-center space-x-2 px-2 hover:text-blue-400 cursor-pointer"
            onClick={() => setTestModalOpen(true)}
          >
            <p className=" text-lg">Add Test</p>

            <AiOutlinePlus
              className=" text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100"
              onClick={() => setTestModalOpen(true)}
            />
          </div>
        </div>
      )}
      <TreeView
        aria-label="icon expansion"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {snackBar}
        {Object.keys(tests).map((url, i) => {
          return (
            <CustomTreeItem
              key={url}
              childrenIds={tests[url].map((test: TestType) => test.id)}
              nodeId={i.toString()}
              label={url}
              endpointId={i.toString()}
              onDelete={() => {
                tests[url].forEach((test: TestType) => {
                  onDeleteClicked(test.id);
                });
                navigator("/test-suites/" + testSuiteId);
              }}
              onExecute={() => {
                return Promise.all(
                  tests[url].map((test: TestType) => {
                    return execute(test.id);
                  }),
                ).then(() => {
                  navigator("/test-suites/" + testSuiteId + "/endpoints/" + i);
                });
              }}
              type="endpoint"
            >
              {tests[url].map((test: TestType) => {
                return (
                  <CustomTreeItem
                    endpointId={i.toString()}
                    onDelete={() => {
                      onDeleteClicked(test.id);
                      navigator(
                        "/test-suites/" + testSuiteId + "/endpoints/" + i,
                      );
                    }}
                    key={test.id}
                    nodeId={test.id}
                    label={test.name}
                    type="test"
                    onExecute={() => {
                      return execute(test.id).then(() => {
                        navigator(
                          "/test-suites/" +
                            testSuiteId +
                            "/endpoints/" +
                            i +
                            "/tests/" +
                            test.id,
                        );
                      });
                    }}
                  />
                );
              })}
            </CustomTreeItem>
          );
        })}
        <AddTestModal
          open={testModalOpen}
          onClose={() => {
            setTestModalOpen(false);
          }}
        />
      </TreeView>
    </>
  );
}
