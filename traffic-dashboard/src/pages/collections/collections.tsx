import { AddBox } from "@mui/icons-material";
import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { createCollection, getCollections } from "../../api/api";
import { RequestRow } from "../../components/request-row/request-row";
import { Collection, InterceptedRequest } from "../../types/types";
import styles from "./collections.module.scss";
import { request } from "express";
import { useNavigate, generatePath } from "react-router-dom";
import { routes } from "../../constants/routes";

export const Collections: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<Collection>();
  const [newCollectionName, setNewCollectionName] = useState<string>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  const loadCollections = () => {
    getCollections().then((res) => {
      setCollections(res.data);
      setSelectedCollection(res.data[0]);
    });
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleCreateCollectionClicked = () => {
    setIsAddDialogOpen(true);
  };

  const handleCollectionClicked = (collection: Collection) => {
    setSelectedCollection(collection);
  };

  const handleAddCollection = () => {
    if (!newCollectionName || newCollectionName === "") {
      return;
    }
    createCollection(newCollectionName)
      .then(() => {
        loadCollections();
      })
      .finally(() => {
        setIsAddDialogOpen(false);
        setNewCollectionName("");
      });
  };

  const navigate = useNavigate();

  const handleRequestClicked = (requestId: InterceptedRequest["id"]) => {
    if (!selectedCollection) {
      return;
    }

    navigate(
      generatePath(routes.COLLECTION_REQUEST, {
        requestId: requestId,
        collectionId: selectedCollection.id,
      }),
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        Collections
        <Button onClick={handleCreateCollectionClicked}>
          <AddBox />
        </Button>
      </div>
      <div className={styles.splitView}>
        <Card className={styles.listContainer}>
          <List>
            {collections.map((collection: Collection) => (
              <ListItemButton
                className={styles.collectionListItem}
                onClick={() => handleCollectionClicked(collection)}
                key={collection.id}
              >
                {collection.name}
              </ListItemButton>
            ))}
          </List>
        </Card>
        <Card className={styles.collectionRequestsCard}>
          <div>{selectedCollection?.name}</div>
          <div>
            {selectedCollection?.requests.map(
              (request) =>
                request && (
                  <RequestRow
                    key={request.id}
                    request={request}
                    serviceId={request.serviceId}
                    onRequestClicked={handleRequestClicked}
                  />
                ),
            )}
          </div>
        </Card>
      </div>
      <Dialog open={isAddDialogOpen} onClose={close}>
        <Card className={styles.card}>
          <Typography>Create a collection</Typography>
          <TextField
            label="Name"
            placeholder="My collection"
            type="string"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <Button onClick={handleAddCollection}>
            {isSaving === true ? <CircularProgress /> : <>add</>}
          </Button>
          <Button color="error" onClick={() => setIsAddDialogOpen(false)}>
            cancel
          </Button>
        </Card>
      </Dialog>
    </div>
  );
};
