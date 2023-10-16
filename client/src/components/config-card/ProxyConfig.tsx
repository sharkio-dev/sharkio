import { TextField, Typography } from "@mui/material";
import React from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import styles from "./config-card.module.scss";
import { StartProxyButton } from "./StartProxyButton";
import { DeleteProxyButton } from "./DeleteProxyButton";
import { SnifferConfigRow } from "./config-card";
import { EditProxyButton } from "./EditProxyButton";

type ProxyConfigProps = {
  sniffer: SnifferConfigRow;
  handleSnifferChanged: (sniffer: SnifferConfigRow) => void;
  handleDeleteClicked: () => void;
  onStart: () => void;
  onStop: () => void;
  onEdit: () => void;
  onSave: () => void;
};
export const ProxyConfig = ({
  sniffer,
  handleSnifferChanged,
  handleDeleteClicked,
  onStart,
  onStop,
  onEdit,
  onSave,
}: ProxyConfigProps) => {
  const navigate = useNavigate();

  const navigateToSniffer = () => {
    navigate(
      generatePath(routes.SERVICE, {
        port: sniffer.config.port,
      }),
    );
  };

  const handlePortChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    handleSnifferChanged({
      ...sniffer,
      config: { ...sniffer.config, port: parseInt(e.target.value) },
    });
  };

  const handleUrlChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    console.log(e.target.value);
    handleSnifferChanged({
      ...sniffer,
      config: { ...sniffer.config, downstreamUrl: e.target.value },
    });
  };

  const handleNameChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    handleSnifferChanged({
      ...sniffer,
      config: { ...sniffer.config, name: e.target.value },
    });
  };

  return (
    <>
      <div className={styles.snifferTitle}>
        <Typography variant="body1" onClick={navigateToSniffer}>
          {sniffer.config.name == "" ? "No Name" : sniffer.config.name}
        </Typography>
      </div>
      <div className="flex flex-col gap-3 mb-2">
        <TextField
          label={"Port"}
          placeholder="1234"
          defaultValue={sniffer.config.port}
          disabled={sniffer.isEditing === false}
          value={sniffer.config.port || ""}
          onChange={handlePortChanged}
        />
        <TextField
          label={"Downstream Url"}
          placeholder="http://example.com"
          defaultValue={sniffer.config.downstreamUrl}
          value={sniffer.config.downstreamUrl || ""}
          disabled={sniffer.isEditing === false}
          onChange={handleUrlChanged}
        />
        <TextField
          label={"Name"}
          placeholder="name"
          defaultValue={sniffer.config.name}
          value={sniffer.config.name || ""}
          disabled={sniffer.isEditing === false}
          onChange={handleNameChanged}
        />
      </div>
      <div className="flex flex-row-reverse justify-between">
        <DeleteProxyButton
          onClick={handleDeleteClicked}
          disabled={sniffer.isStarted === true}
        />
        <div className="flex flex-row-reverse justify-between">
          <EditProxyButton
            onEdit={onEdit}
            onSave={onSave}
            disabled={
              sniffer.isNew
                ? sniffer.config.port === undefined ||
                  sniffer.config.downstreamUrl === undefined
                : sniffer.isStarted === true
            }
            canEdit={sniffer.isNew === false}
          />

          <StartProxyButton
            onStart={onStart}
            onStop={onStop}
            disabled={sniffer.isEditing === true}
          />
        </div>
      </div>
    </>
  );
};
