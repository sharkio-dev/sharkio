// import React, { useState } from "react";
// import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
// import { ProjectType, getProjects } from "../../api/api";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// const ProjectItem = ( project: ProjectType, handleEditProject: (e: React.MouseEvent, name: string) => void, handleDeleteProject: (e: React.MouseEvent, name: string) => void) => {


//   return (
//     <MenuItem
//       className="flex items-center"
//       key={project.id}
//       value={project.name}
//     >
//       <div>{project.name}</div>
//       {project.isOpen !== true(
//         <>
//           <div className="flex items-end space-x-2">
//             <AiOutlineEdit
//               className="text-amber-200 text-lg"
//               onClick={(e: React.MouseEvent) =>
//                 handleEditProject(e, project.name)
//               }
//             />
//             <AiOutlineDelete
//               className="text-red-200 text-lg"
//               onClick={(e: React.MouseEvent) =>
//                 handleDeleteProject(e, project.name)
//               }
//             />
//           </div>
//         </>
//       ) : null}
//     </MenuItem>
//   );
// };

// export default ProjectItem;
