import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useRouter } from "next/router";
import styles from "./new-request.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { execute } from "@/api/requests";
import { Invocation } from "@/types/types";
import { isJsonString } from "@/utils/utils";
import { useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton';

type NewRequestForm = {
  url: string;
  body: string;
  headers: string;
  cookies: string;
  method: string;
};

const NewRequest = () => {
  const router = useRouter();
  const data = router.query;
  const [executing, setExecuting] = useState<Boolean>(false);

  const { register, watch, handleSubmit, setValue } = useForm<NewRequestForm>();
  const formData = watch();

  const handleFormSubmit: SubmitHandler<NewRequestForm> = (
    form: NewRequestForm
  ) => {
    const invocation: Invocation = {
      url: form.url,
      method: form.method,
      invocation: {
        body: form.body,
        headers: form.headers,
      },
    };
    setExecuting(true);
    execute(invocation).finally(() => setExecuting(false));
  };

  return (
    <div className={styles.container}>
      <Select
        label="sadfasfd"
        placeholder="Method"
        variant="filled"
        {...register("method")}
      >
        <MenuItem value={"POST"}>POST</MenuItem>
        <MenuItem value={"GET"}>GET</MenuItem>
        <MenuItem value={"PUT"}>PUT</MenuItem>
      </Select>
      <TextField
        id="outlined-textarea"
        label="Url"
        placeholder="http://example.com"
        variant="filled"
        {...register("url")}
      />
      <TextField
        id="outlined-textarea"
        label="Body"
        placeholder=""
        multiline
        rows={4}
        variant="filled"
        {...register("body")}
        onChange={(e) => {
          const { value } = e.target;
          if (isJsonString(value)) {
            setValue("body", JSON.stringify(JSON.parse(value), null, 2), {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }
        }}
      />
      <TextField
        id="outlined-textarea"
        label="Headers"
        placeholder="Placeholder"
        multiline
        rows={4}
        variant="filled"
        {...register("headers")}
      />
      <TextField
        id="outlined-textarea"
        label="Cookies"
        placeholder="Placeholder"
        multiline
        rows={4}
        variant="filled"
        {...register("cookies")}
      />

      <LoadingButton
        variant="contained"
        color="success"
        onClick={handleSubmit(handleFormSubmit)}
        loading={executing}
      >
        execute
      </LoadingButton>

      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
};

export default NewRequest;
