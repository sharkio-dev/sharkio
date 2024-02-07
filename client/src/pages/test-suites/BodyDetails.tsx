import { Editor } from "@monaco-editor/react";

type BodyDetailsProps = {
  status?: "success" | "failure";
  expectedValue: string;
  actualValue: string;
};
export const BodyDetails = ({
  status = "success",
  expectedValue,
  actualValue,
}: BodyDetailsProps) => {
  return (
    <div className="flex flex-row items-center w-full py rounded-lg pb-4 space-x-4 px-4">
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <Editor
          height={"20vh"}
          theme="vs-dark"
          defaultLanguage="json"
          value={JSON.stringify(expectedValue)}
          options={{
            readOnly: true,
            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <span className="text text-xs">
          {status === "success" ? (
            <span className="text-green-400">✓</span>
          ) : (
            <span className="text-red-400">✗</span>
          )}
        </span>
        <Editor
          height={"20vh"}
          theme="vs-dark"
          defaultLanguage="json"
          value={actualValue}
          options={{
            readOnly: true,
            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
    </div>
  );
};
