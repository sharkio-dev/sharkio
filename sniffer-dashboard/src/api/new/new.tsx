import { TextField } from "@mui/material";
import { useRouter } from "next/router";

export const NewRequest = () => {
  const router = useRouter();
  const data = router.query;

  return (
    <>
      <TextField
        id="outlined-textarea"
        label="Multiline Placeholder"
        placeholder="Url"
        multiline
      />
      <TextField
        id="outlined-textarea"
        label="Multiline Placeholder"
        placeholder="Method"
        multiline
      />
      <TextField
        id="outlined-textarea"
        label="Multiline Placeholder"
        placeholder="Body"
        multiline
      />
      <TextField
        id="outlined-textarea"
        label="Multiline Placeholder"
        placeholder="Headers"
        multiline
      />
    </>
  );
};
