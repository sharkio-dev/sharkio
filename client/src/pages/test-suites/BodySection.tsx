import Editor from "@monaco-editor/react";

type BodySectionProps = {
  body: any;
  onChangeBody: (body: any) => void;
};

export const BodySection = ({ body, onChangeBody }: BodySectionProps) => {
  // console.log({ body, type: typeof body });

  const onChangeBodyValue = (value: any, event: any) => {
    if (typeof value !== "string" && value.includes("html")) {
      onChangeBody(value);
      return;
    }
    //  console.log({ value, event });
    const res = JSON.parse(value);
    onChangeBody(res);
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
