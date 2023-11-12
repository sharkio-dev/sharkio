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
import {
  Button,
  CircularProgress,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { BackendAxios } from "../../api/backendAxios";

type AddTestModalProps = {
  open: boolean;
  onClose: () => void;
};

const AddTestModal = ({ open, onClose }: AddTestModalProps) => {
  const [name, setName] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onClickAdd = () => {
    if (name === "") {
      return;
    }
    setIsLoading(true);
    // TODO: Add test suite
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex justify-center items-center border-0"
    >
      <Paper className="flex flex-col p-4 w-96 rounded-sm border-0">
        <div className="text-2xl font-bold">Add Test</div>
        <div className="w-full border-b-[0.05px] my-4" />
        <div className="flex flex-col space-y-2"></div>
        <TextField
          label={"Name"}
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <div className="flex flex-row justify-end mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={onClickAdd}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};

type CustomContentProps = {
  type: "endpoint" | "test";
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

  const handleDeleteClick = () => {
    if (isDeleteClicked) {
      // TODO: Delete test
      return;
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
          <AiOutlineDelete
            className={`text-[#fff] text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100 ${
              isDeleteClicked && "text-red-500"
            }`}
            onClick={handleDeleteClick}
          />
          {type === "endpoint" && (
            <AiOutlinePlus
              className="text-[#fff] text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100"
              onClick={() => setAddTestModalOpen(true)}
            />
          )}
          <AiOutlinePlayCircle className="text-green-400 text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100" />
        </div>
      )}
      <AddTestModal
        open={addTestModalOpen}
        onClose={() => setAddTestModalOpen(false)}
      />
    </div>
  );
}

const CustomContentRef = React.forwardRef(CustomContent);

type CustomTreeItemProps = {
  type: "endpoint" | "test";
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
  const [testTree, setTestTree] = React.useState<any>({});

  React.useEffect(() => {
    if (!testSuiteId) {
      return;
    }
    BackendAxios.get(`/test-suites/${testSuiteId}/tests`).then((res) => {
      console.log({ res: res.data });
      const a = res.data.reduce((acc, test) => {
        const url = test.url;
        if (Object.hasOwnProperty.call(acc, url)) {
          // If URL exists in accumulator, append the current test object to its array
          acc[url] = [...acc[url], test];
        } else {
          // If URL does not exist, create a new array with the current test object
          acc[url] = [test];
        }
        return acc;
      }, {});
      setTestTree(a);
    });
  }, [testSuiteId]);

  return (
    <TreeView
      aria-label="icon expansion"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {
        // For each URL, create a tree item
        Object.keys(testTree).map((url) => {
          return (
            <CustomTreeItem key={url} nodeId={url} label={url} type="endpoint">
              {
                // For each test in the URL, create a tree item
                testTree[url].map((test: any) => {
                  return (
                    <CustomTreeItem
                      key={test.id}
                      nodeId={test.id}
                      label={test.name}
                      type="test"
                    />
                  );
                })
              }
            </CustomTreeItem>
          );
        })
      }
    </TreeView>
  );
}
