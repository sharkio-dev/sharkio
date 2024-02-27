import { Tooltip } from "@mui/material";
import { useState } from "react";
import { CiLink } from "react-icons/ci";

type CopyLinkProps = {
  link: string;
};

export const CopyLinkComponent = ({ link }: CopyLinkProps) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyClick = (event: any) => {
    event.stopPropagation();
    navigator.clipboard.writeText(`${link}`).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div>
      <Tooltip
        title={copySuccess ? "Link Copied!" : "Copy Link"}
        placement="top-end"
      >
        <div>
          <CiLink onClick={handleCopyClick} />
        </div>
      </Tooltip>
    </div>
  );
};

export default CopyLinkComponent;
