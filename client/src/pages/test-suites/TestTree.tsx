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
import {
  TestType,
  deleteTest,
  getTestByTestSuiteId,
} from "../../stores/testStore";
import { AddTestSuiteModal } from "./TestSuiteSideBar";

type CustomContentProps = {
  type: "endpoint" | "test";
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

  const handleSelectionClick = (event: any) => {
    if (type === "test") {
      navigator("/test-suites/" + testSuiteId + "/tests/" + nodeId);
    }
    handleSelection(event);
  };

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
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
      {selected && (
        <div className="flex flex-row items-center space-x-2 px-2">
          {type === "test" && (
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
          {type === "test" && (
            <AiOutlinePlayCircle className="text-green-400 text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100" />
          )}
        </div>
      )}
      <AddTestSuiteModal
        open={addTestModalOpen}
        onClose={() => setAddTestModalOpen(false)}
        type="Test Endpoint"
      />
    </div>
  );
}

const CustomContentRef = React.forwardRef(CustomContent);

type CustomTreeItemProps = {
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
      ContentComponent={(p) => <CustomContentRef {...props} {...p} />}
      {...props}
      ref={ref}
    />
  );
};

const CustomTreeItem = React.forwardRef(CustomTreeItemRef);

export function TestTree() {
  const { testSuiteId } = useParams();
  const [testTree, setTestTree] = React.useState<Record<string, TestType[]>>(
    {},
  );
  const { show, component: snackBar } = useSnackbar();

  const fetchTestTree = () => {
    if (!testSuiteId) {
      return;
    }
    getTestByTestSuiteId(testSuiteId).then((res) => {
      const a = res.data.reduce(
        (acc: Record<string, TestType[]>, test: TestType) => {
          const url = test.url;
          if (Object.hasOwnProperty.call(acc, url)) {
            acc[url] = [...acc[url], test];
          } else {
            acc[url] = [test];
          }
          return acc;
        },
        {},
      );
      setTestTree(a);
    });
  };

  React.useEffect(() => {
    if (!testSuiteId) {
      return;
    }
    fetchTestTree();
  }, [testSuiteId]);

  const onDeleteClicked = (testId: string) => {
    deleteTest(testId)
      .then(() => {
        show("Test deleted successfully", "success");
        fetchTestTree();
      })
      .catch(() => {
        show("Failed to delete test", "error");
      });
  };

  return (
    <TreeView
      aria-label="icon expansion"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {Object.keys(testTree).map((url) => {
        return (
          <CustomTreeItem key={url} nodeId={url} label={url} type="endpoint">
            {testTree[url].map((test: any) => {
              return (
                <CustomTreeItem
                  onDelete={() => onDeleteClicked(test.id)}
                  key={test.id}
                  nodeId={test.id}
                  label={test.name}
                  type="test"
                />
              );
            })}
          </CustomTreeItem>
        );
      })}
    </TreeView>
  );
}
