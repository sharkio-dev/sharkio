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

type CustomContentProps = {
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
          <AiOutlineDelete className="text-[#fff] text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100" />
          <AiOutlinePlus className="text-[#fff] text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100" />
          <AiOutlinePlayCircle className="text-green-400 text-sm hover:bg-border-color rounded-md hover:cursor-pointer hover:scale-110 active:scale-100" />
        </div>
      )}
    </div>
  );
}
const CustomContentRef = React.forwardRef(CustomContent);
type CustomTreeItemProps = {
  nodeId: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  expansionIcon?: React.ReactNode;
  displayIcon?: React.ReactNode;
  children?: React.ReactNode;
};
const CustomTreeItemRef = (props: CustomTreeItemProps, ref: React.Ref<any>) => {
  return <TreeItem ContentComponent={CustomContentRef} {...props} ref={ref} />;
};
const CustomTreeItem = React.forwardRef(CustomTreeItemRef);

export function TestTree() {
  return (
    <TreeView
      aria-label="icon expansion"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <CustomTreeItem nodeId="1" label="/Users">
        <CustomTreeItem nodeId="2" label="Positive" />
      </CustomTreeItem>
    </TreeView>
  );
}
