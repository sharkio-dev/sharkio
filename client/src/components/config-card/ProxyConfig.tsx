import { TextField, Typography } from "@mui/material";
import React from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { EditProxyButton } from "./EditProxyButton";
import { StartProxyButton } from "./StartProxyButton";
import { SnifferConfigRow } from "./config-card";
import styles from "./config-card.module.scss";
import { ConfigButton } from "./ConfigButton";
import { Delete } from "@mui/icons-material";

type ProxyConfigProps = {
  sniffer: SnifferConfigRow;
  handleSnifferChanged: (sniffer: SnifferConfigRow) => void;
  handleDeleteClicked: () => void;
  onStart: () => void;
  onStop: () => void;
  onEdit: () => void;
  onSave: () => void;
  isLoadingStarted?: boolean;
  isLoadingEdit?: boolean;
  isLoadingDelete?: boolean;
};
export const ProxyConfig = ({
  sniffer,
  handleSnifferChanged,
  handleDeleteClicked,
  onStart,
  onStop,
  onEdit,
  onSave,
  isLoadingStarted,
  isLoadingEdit,
  isLoadingDelete,
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
  console.log(sniffer);

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
        <ConfigButton
          tooltip={"Remove the sniffer"}
          onClick={handleDeleteClicked}
          disabled={sniffer.isStarted === true}
          isLoading={isLoadingDelete}
        >
          <Delete color={sniffer.isStarted === true ? "disabled" : "error"} />
        </ConfigButton>
        <div className="flex flex-row-reverse justify-between">
          <EditProxyButton
            onEdit={onEdit}
            onSave={!sniffer.isNew ? onEdit : onSave}
            disabled={
              sniffer.isNew
                ? sniffer.config.port === undefined ||
                  sniffer.config.downstreamUrl === undefined
                : sniffer.isStarted === true
            }
            isEditing={!sniffer.isNew && sniffer.isEditing}
            isLoading={isLoadingEdit}
          />

          <StartProxyButton
            onStart={onStart}
            onStop={onStop}
            disabled={sniffer.isEditing === true}
            isStarted={sniffer.isStarted === true}
            isLoading={isLoadingStarted}
          />
        </div>
      </div>
    </>
  );
};
