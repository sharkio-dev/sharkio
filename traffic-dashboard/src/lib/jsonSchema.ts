import { InterceptedRequest } from "../types/types";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = Array<JsonValue>;

export interface JsonSchema {
  $schema?: string;
  type:
    | "object"
    | "array"
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "null"
    | "function"
    | "undefined"
    | "null"
    | "symbol"
    | "bigint";
  properties?: { [key: string]: JsonSchema };
  items?: JsonSchema;
  required?: string[];
}

export function generateJsonSchema(jsonObject: JsonObject): JsonSchema {
  const schema: JsonSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {},
    required: [],
  };

  if (jsonObject === undefined) {
    return schema;
  }
  const stack: [JsonSchema, JsonValue][] = [[schema, jsonObject]];

  while (stack.length) {
    const [currentSchema, currentObject] = stack.pop()!;

    if (currentObject !== null) {
      for (const [key, value] of Object.entries(currentObject)) {
        if (value === null) {
          currentSchema.properties![key] = { type: "null" };
        } else if (Array.isArray(value)) {
          const itemSchema: JsonSchema = {
            type: "object",
            properties: {},
            required: [],
          };
          currentSchema.properties![key] = { type: "array", items: itemSchema };
          stack.push([itemSchema, value[0] ?? {}]);
        } else if (typeof value === "object") {
          const nestedSchema: JsonSchema = {
            type: "object",
            properties: {},
            required: [],
          };
          currentSchema.properties![key] = nestedSchema;
          stack.push([nestedSchema, value]);
        } else {
          currentSchema.properties![key] = { type: typeof value };
        }
      }
    }
  }

  return schema;
}

export function jsonSchemaToTypescriptInterface(
  schema: JsonSchema,
  interfaceName = "",
  isNested = false,
): string {
  let output = isNested ? "" : `type${" " + interfaceName + " "} = {\n`;

  if (schema.type === "object" && schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      output += `  ${key}: ${jsonSchemaToTypescriptInterface(
        value,
        key,
        true,
      )}`;
    }
  } else if (schema.type === "array" && schema.items) {
    output += `  ${jsonSchemaToTypescriptInterface(
      schema.items,
      "",
      true,
    )}[];\n`;
  } else if (schema.type === "string") {
    output += "string;\n";
  } else if (schema.type === "number") {
    output += "number;\n";
  } else if (schema.type === "boolean") {
    output += "boolean;\n";
  }

  output += isNested ? "" : "}";
  return output;
}

export function generateCurlCommand(req: InterceptedRequest): string {
  const host = req.invocations[0].headers.host;
  let curlCommand = `curl -X ${req.method} http://${host}${req.url} \\\n`;

  // Add request headers
  for (const [key, value] of Object.entries(req.invocations[0].headers)) {
    if (key === "host" || key.includes("sec-ch-ua")) {
      continue;
    }
    curlCommand += `\t-H "${key}: ${value}" \\\n`;
  }

  // Add request body, if present
  if (req.invocations[0].body) {
    curlCommand += `\t-d '${JSON.stringify(req.invocations[0].body)}' \\\n`;
  }

  return curlCommand.slice(0, -2);
}
