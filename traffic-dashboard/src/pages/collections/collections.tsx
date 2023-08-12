import React, { useEffect, useState } from 'react';
import { Button, Card, List, ListItem } from '@mui/material';
import { createCollection, getCollections } from '../../api/api';
import { Collection } from '../../types/types';

export const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const loadCollections = () => {
    getCollections().then((res) => setCollections(res.data));
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleCreateCollectionClicked = () => {
    createCollection('my collection').then(() => {
      loadCollections();
    });
  };

  return (
    <>
      Collections
      <Card>
        <Button onClick={handleCreateCollectionClicked}>Create</Button>
        <List>
          {collections.map((collection: Collection) => (
            <ListItem key={collection.id}>{collection.name}</ListItem>
          ))}
        </List>
      </Card>
    </>
  );
};
