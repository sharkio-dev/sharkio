import { Card } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
} from "quicktype-core";

async function quicktypeJSON(
  targetLanguage: string,
  typeName: string,
  jsonString: string
) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);

  // We could add multiple samples for the same desired
  // type, or many sources for other types. Here we're
  // just making one type from one piece of sample JSON.
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
    rendererOptions: {
      interfacesOnly: 
    },
  });
}

const Request = () => {
  const router = useRouter();
  const [data, setData] = useState<any>({});
  const [generatedType, setGeneratedType] = useState<any>();

  const { method } = router.query;

  useEffect(() => {
    if (router.query.data !== undefined) {
      setData(JSON.parse(router.query.data as string));
      quicktypeJSON(
        "typescript",
        "Invocation",
        router.query.data as string
      ).then((res) => {
        setGeneratedType(res.lines.join("\n"));
      });
    }
  }, [router.query]);

  return (
    <Card>
      <div>{`${data.method}`}</div>
      <div>{generatedType}</div>
    </Card>
  );
};

export default Request;
