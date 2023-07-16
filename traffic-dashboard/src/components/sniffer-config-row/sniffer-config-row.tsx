// import { PlayArrow, Stop, Save, Edit, Delete } from "@mui/icons-material";
// import {
//   Tooltip,
//   Button,
//   CircularProgress,
//   Typography,
//   Collapse,
//   TextField,
// } from "@mui/material";
// import { SnifferCreateConfig } from "../../types/types";
// import { SnifferConfigRow } from "../config-card/config-card";
// import { generatePath, useNavigate } from "react-router-dom";
// import { routes } from "../../constants/routes";
// import styles from "./sniffer-config-row.module.scss";

// interface ISnifferConfigProps {
//   sniffer: SnifferConfigRow;
//   index: number;
// }

// export const ConfigRow: React.FC<ISnifferConfigProps> = (
//   sniffer: SnifferConfigRow,
//   index: number
// ) => {
//   const navigate = useNavigate();

//   const handleSnifferClicked = () => {
//     navigate(
//       generatePath(routes.SERVICE, {
//         port: sniffer.config.port,
//       })
//     );
//   };

//   return (
//     <>
//       {!sniffer.isEditing && (
//         <Typography
//           className={styles.snifferTitle}
//           variant="h5"
//           onClick={handleSnifferClicked}
//         >
//           {sniffer.config.name == "" ? "No Name" : sniffer.config.name}
//         </Typography>
//       )}
//       <Collapse orientation="horizontal" in={sniffer.isEditing}>
//         <TextField
//           label={"Port"}
//           placeholder="1234"
//           defaultValue={sniffer.config.port}
//           disabled={sniffer.isEditing === false}
//           value={sniffer.config.port || ""}
//           onChange={(
//             e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
//           ) => {
//             handlePortChanged(e, index);
//           }}
//         />
//       </Collapse>
//       <Collapse orientation="horizontal" in={sniffer.isEditing}>
//         <TextField
//           label={"Proxy url"}
//           placeholder="http://example.com"
//           defaultValue={sniffer.config.downstreamUrl}
//           value={sniffer.config.downstreamUrl || ""}
//           disabled={sniffer.isEditing === false}
//           onChange={(
//             e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
//           ) => {
//             handleUrlChanged(e, index);
//           }}
//         />
//       </Collapse>
//       <Collapse orientation="horizontal" in={sniffer.isEditing}>
//         <TextField
//           label={"Name"}
//           placeholder="name"
//           defaultValue={sniffer.config.name}
//           value={sniffer.config.name || ""}
//           disabled={sniffer.isEditing === false}
//           onChange={(
//             e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
//           ) => {
//             handleNameChanged(e, index);
//           }}
//         />
//       </Collapse>
//     </>
//   );
// };

// export const snifferConfigRow = () => {
//   return (
//     <div key={`config-row-${index}`} className={styles.inputs}>
//       {snifferConfigForm(sniffer, index)}
//       {sniffer.isNew === false && (
//         <>
//           <Tooltip title={"Start sniffing requests"}>
//             <Button
//               color="success"
//               onClick={() =>
//                 sniffer.config.port !== undefined &&
//                 handleStartClicked(sniffer.config.port)
//               }
//               disabled={
//                 sniffer.isStarted === true || sniffer.isEditing === true
//               }
//             >
//               {startLoading === true ? <CircularProgress /> : <PlayArrow />}
//             </Button>
//           </Tooltip>
//           <Tooltip title={"Stop sniffing requests"}>
//             <Button
//               color="warning"
//               disabled={sniffer.isStarted === false}
//               onClick={() =>
//                 sniffer.config.port !== undefined &&
//                 handleStopClicked(sniffer.config.port)
//               }
//             >
//               {stopLoading === true ? <CircularProgress /> : <Stop></Stop>}
//             </Button>
//           </Tooltip>
//           <Tooltip
//             title={sniffer.isEditing ? "Save changes" : "Edit the sniffer"}
//           >
//             <Button
//               color="info"
//               onClick={() => {
//                 handleEditClicked(index, sniffer.config as SnifferCreateConfig);
//               }}
//               disabled={sniffer.isStarted === true}
//             >
//               {sniffer.isEditing ? <Save /> : <Edit />}
//             </Button>
//           </Tooltip>
//         </>
//       )}
//       {sniffer.isNew === true && (
//         <>
//           <Tooltip title="Save new sniffer">
//             <Button
//               color="info"
//               disabled={
//                 sniffer.config.port === undefined ||
//                 sniffer.config.downstreamUrl === undefined
//               }
//               onClick={() => {
//                 handleSaveClicked(sniffer.config);
//               }}
//             >
//               {saveLoading === true ? <CircularProgress /> : <Save />}
//             </Button>
//           </Tooltip>
//         </>
//       )}
//       <Tooltip title="Remove the sniffer">
//         <Button
//           color="error"
//           onClick={() => {
//             handleDeleteClicked(index);
//           }}
//           disabled={sniffer.isStarted === true}
//         >
//           <Delete></Delete>
//         </Button>
//       </Tooltip>
//     </div>
//   );
// };
