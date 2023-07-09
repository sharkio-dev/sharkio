import { useContext, useEffect, useState } from "react";
import { RequestsMetadataContext } from "../../context/requests-context";
import { Autocomplete, Button, Card, Chip, TextField } from "@mui/material";
import styles from "./gen-openapi.module.scss"
import { OpenAPIDocument } from "../../lib/openapi.interface";
import { JsonToOpenapi } from "../../lib/generateOpenapi";

export const GenOpenAPI = () => {
    const {
        requestsData: requests,
        servicesData: services,
        loadData,
      } = useContext(RequestsMetadataContext);
    
      const [apiName, setApiName] = useState<string>("");
      const [service, setServices] = useState<string>("");
      const [apiVersion, setApiVersion] = useState<string>("");
      const [openApiDoc, setOpenApiDoc] = useState<OpenAPIDocument>()

      const onSubmit = () => {
        const filteredRequests: [] = requests.filter((req: any) => req.service === service )
        setOpenApiDoc(JsonToOpenapi(filteredRequests, apiName, apiVersion))
      }

      useEffect(() => {
        loadData?.();
      }, []);

      return (
        <div>
        <Card className={styles.card}>
        <TextField
          label="API name"
          placeholder="API"
          type="string"
          value={apiName}
          onChange={(e) => setApiName(e.target.value)}
        />
        <Autocomplete
        freeSolo
        disablePortal     
        renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }   
        options={services}
        sx={{ width: 200 }}
        renderInput={(params) => (
            <TextField {...params} label="Service"/>   
            )}
        onChange={(_, value: string | null) => {
            const newValue: string = value ?? ""; 
            setServices(newValue)
        }}
      />
      <TextField
          label="API version"
          placeholder="1.0.0"
          type="string"
          value={apiVersion}
          onChange={(e) => setApiVersion(e.target.value)}
        />
      <Button 
        onClick={onSubmit}
        disabled={!service || !apiName || !apiVersion}>Create API</Button>
        </Card>

      <div>
        <pre>{JSON.stringify(openApiDoc, null, 2)}</pre> 
      </div>
    </div>
    )
}