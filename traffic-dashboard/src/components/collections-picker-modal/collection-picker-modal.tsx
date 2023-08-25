import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Dialog,
  List,
  ListItemButton,
  Modal,
  Typography,
} from "@mui/material";
import { Collection } from "../../types/types";
import { getCollections } from "../../api/api";
import styles from "./collection-picker-modal.module.scss";

interface ICollectionPickerModalProps {
  open: boolean;
  onClose: () => void;
  onChoose: (collectionId: Collection["id"]) => void;
}

export const CollectionPickerModal: React.FC<ICollectionPickerModalProps> = ({
  open,
  onClose,
  onChoose,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const loadCollections = () => {
    getCollections().then((res) => {
      setCollections(res.data);
    });
  };

  useEffect(() => {
    loadCollections();
  }, []);

  return (
    <Dialog open={open}>
      <Card className={styles.card}>
        <Typography>Choose a collection</Typography>
        <List>
          {collections.map((collection) => {
            return (
              <ListItemButton
                key={collection.id}
                onClick={() => {
                  onChoose(collection.id);
                }}
              >
                {collection.name}
              </ListItemButton>
            );
          })}
        </List>
        <Button color="error" onClick={onClose}>
          cancel
        </Button>
      </Card>
    </Dialog>
  );
};
