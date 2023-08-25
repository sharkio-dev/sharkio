import React, { useState } from "react";
import { useContext, useEffect } from "react";
import { RequestsMetadataContext } from "../../context/requests-context";
import { RequestPage } from "../../components/request-page/request";
import { useParams } from "react-router-dom";
import { getCollections } from "../../api/api";
import { Collection } from "../../types/types";

export const CollectionRequest = () => {
  const { collectionId, requestId } = useParams();
  const [collections, setCollections] = useState<Collection[]>([]);
  const loadCollections = () => {
    getCollections().then((res) => {
      setCollections(res.data);
    });
  };

  const { loadData, servicesData: services } = useContext(
    RequestsMetadataContext,
  );

  useEffect(() => {
    loadCollections();
    loadData?.();
  }, []);

  const collection = collections.find(
    (collection) => collection.id === collectionId,
  );

  const request = collection?.requests.find(
    (request) => request.id === requestId,
  );
  const service = services?.find(
    (service) => service.id === request?.serviceId,
  );

  return service && request ? (
    <RequestPage service={service} request={request} />
  ) : (
    "not found"
  );
};
