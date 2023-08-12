import { AddBox, Construction } from '@mui/icons-material';
import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { createCollection, getCollections } from '../../api/api';
import { Collection } from '../../types/types';
import styles from './collections.module.scss';

export const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection>();
  const [newCollectionName, setNewCollectionName] = useState<string>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  const loadCollections = () => {
    getCollections().then((res) => setCollections(res.data));
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
    if (!newCollectionName || newCollectionName === '') {
      return;
    }
    createCollection(newCollectionName)
      .then(() => {
        loadCollections();
      })
      .finally(() => {
        setIsAddDialogOpen(false);
        setNewCollectionName('');
      });
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
          {selectedCollection?.name}

          <div className={styles.construction}>
            <div>
              <Construction className={styles.constructionIcon} />
            </div>
            <div>This part is still under construction</div>
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
