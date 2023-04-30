import {
  JsonSchema,
  generateJsonSchema,
  jsonSchemaToTypescriptInterface,
} from "../../../lib/jsonSchema";

describe("generateJsonSchema", () => {
  it("should return schema correctly", () => {
    const object = {
      hello: "world",
    };

    const res = generateJsonSchema(object);

    expect(res).toEqual({
      $schema: "http://json-schema.org/draft-07/schema#",
      properties: {
        hello: {
          type: "string",
        },
      },
      required: [],
      type: "object",
    });
  });

  it("should return schema correctly for nested object", () => {
    const object = {
      hello: {
        this: "world",
      },
    };

    const res = generateJsonSchema(object);

    expect(res).toEqual({
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        hello: {
          type: "object",
          properties: {
            this: {
              type: "string",
            },
          },
          required: [],
        },
      },
      required: [],
    });
  });
});

describe("generateTypescriptType", () => {
  it("generate from JsonSchema", () => {
    const schema: JsonSchema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      properties: {
        hello: {
          type: "string",
        },
      },
      required: [],
      type: "object",
    };

    const res = jsonSchemaToTypescriptInterface(schema, "ISchema");

    expect(res).toBeDefined();
    expect(res).toEqual("type ISchema = {  hello: string;}");
  });
});
