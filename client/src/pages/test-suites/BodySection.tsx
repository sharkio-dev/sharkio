import Editor from "@monaco-editor/react";

type BodySectionProps = {
  body: any;
  setBody: (body: any) => void;
};

export const BodySection = ({ body, setBody }: BodySectionProps) => {
  console.log({ body, type: typeof body });

  const onChangeBodyValue = (value: any, event) => {
    if (typeof value !== "string" && value.includes("html")) {
      setBody(value);
      return;
    }
    console.log({ value, event });
    const res = JSON.parse(value, null, 2);
    setBody(res);
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <Editor
        height="50vh"
        width={"100%"}
        theme="vs-dark"
        defaultLanguage="json"
        value={typeof body === "string" ? body : JSON.stringify(body, null, 2)}
        language={
          typeof body === "string" && body.includes("html") ? "html" : "json"
        }
        onChange={(value, event) => onChangeBodyValue(value, event)}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};
