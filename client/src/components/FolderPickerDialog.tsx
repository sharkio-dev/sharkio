import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
  CircularProgress,
  Typography,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { browseFilesystem } from "../api/api";

type Props = {
  open: boolean;
  initialPath?: string;
  onSelect: (path: string) => void;
  onClose: () => void;
};

export const FolderPickerDialog = ({
  open,
  initialPath,
  onSelect,
  onClose,
}: Props) => {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [entries, setEntries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = (dirPath?: string) => {
    setLoading(true);
    setError(null);
    browseFilesystem(dirPath)
      .then(({ path, entries }) => {
        setCurrentPath(path);
        setEntries(entries);
      })
      .catch(() => setError("Cannot read directory"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) navigate(initialPath || undefined);
  }, [open]);

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  const navigateToSegment = (index: number) => {
    const target = "/" + breadcrumbs.slice(0, index + 1).join("/");
    navigate(target);
  };

  const navigateUp = () => {
    const parent = currentPath.split("/").slice(0, -1).join("/") || "/";
    navigate(parent);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select folder</DialogTitle>
      <DialogContent dividers>
        <Breadcrumbs className="mb-2">
          <Link
            component="button"
            underline="hover"
            onClick={() => navigate("/")}
          >
            /
          </Link>
          {breadcrumbs.map((segment, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={i} color="text.primary">
                {segment}
              </Typography>
            ) : (
              <Link
                key={i}
                component="button"
                underline="hover"
                onClick={() => navigateToSegment(i)}
              >
                {segment}
              </Link>
            );
          })}
        </Breadcrumbs>

        {loading ? (
          <div className="flex justify-center py-6">
            <CircularProgress size={28} />
          </div>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <List dense disablePadding>
            {currentPath !== "/" && (
              <ListItemButton onClick={navigateUp}>
                <ListItemIcon>
                  <FolderIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary=".." />
              </ListItemButton>
            )}
            {entries.map((name) => (
              <ListItemButton
                key={name}
                onClick={() => navigate(`${currentPath}/${name}`)}
              >
                <ListItemIcon>
                  <FolderOpenIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            ))}
            {entries.length === 0 && (
              <Typography color="text.secondary" className="px-2 py-3">
                No subdirectories
              </Typography>
            )}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            onSelect(currentPath);
            onClose();
          }}
        >
          Select "{currentPath.split("/").pop() || "/"}"
        </Button>
      </DialogActions>
    </Dialog>
  );
};
