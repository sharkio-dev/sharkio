type CreateCollectionBody = {
  name: string;
};

type UpdateCollectionBody = {
  id: string;
  name?: string;
};

type Collection = {
  id: string;
  name: string;
};
