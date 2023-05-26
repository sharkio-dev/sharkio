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
  isNested = false
): string {
  let output = isNested ? "" : `type ${interfaceName} = {`;

  if (schema.type === "object" && schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      output += `  ${key}: ${jsonSchemaToTypescriptInterface(
        value,
        key,
        true
      )}`;
    }
  } else if (schema.type === "array" && schema.items) {
    output += `  ${jsonSchemaToTypescriptInterface(schema.items, "", true)}[];`;
  } else if (schema.type === "string") {
    output += "string;";
  } else if (schema.type === "number") {
    output += "number;";
  } else if (schema.type === "boolean") {
    output += "boolean;";
  }

  output += isNested ? "" : "}";
  return output;
}
