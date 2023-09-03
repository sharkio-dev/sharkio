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
  console.log(jsonObject);
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

export function generateApiRequestSnippet(
  language: String,
  method: String,
  url: String,
  headers: any,
  requestBody: any = null,
  queryParams: any = null,
) {
  let snippet = "";

  url = url + jsonToQueryString(queryParams);

  switch (language) {
    case "javascript":
      snippet = generateJsSnippet(snippet, url, method, headers, requestBody);
      break;
    case "python":
      snippet = generatePythonSnippet(
        snippet,
        url,
        headers,
        method,
        requestBody,
      );
      break;
    case "java":
      snippet = generateJavaOkHttpSnippet(
        snippet,
        url,
        method,
        headers,
        requestBody,
      );
      break;
    case "golang":
      snippet = generateGoLangSnippet(
        snippet,
        url,
        method,
        headers,
        requestBody,
      );
      break;
    case "php":
      snippet = generatePhpGuzzle(snippet, url, headers, requestBody, method);
      break;
    default:
      snippet = "Unsupported language";
  }

  return snippet;
}

const jsonToQueryString = (json: JsonObject): String => {
  if (!json) {
    return "";
  }
  return Object.keys(json)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(json[key]))
    .join("&");
};
const generateGoLangSnippet = (
  snippet: string,
  url: String,
  method: String,
  headers: any,
  requestBody: any,
) => {
  snippet += `package main

import (
	"bytes"
	"fmt"
	"net/http"
	"io/ioutil"
)

func main() {
	url := "${url}"
	method := "${method}"
`;

  // Add headers
  for (const [key, value] of Object.entries(headers)) {
    snippet += `
	headers := map[string]string{
		"${key}": "${value}",
	}`;
  }

  // Add request body if provided
  if (requestBody) {
    snippet += `
	requestBody := []byte(\`${JSON.stringify(requestBody)}\`)`;
  } else {
    snippet += `
	var requestBody []byte`;
  }

  snippet += `
  
	req, err := http.NewRequest(method, url, bytes.NewBuffer(requestBody))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}
  
	// Set headers
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return
	}
	defer resp.Body.Close()
  
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response:", err)
		return
	}
  
	fmt.Println("Response:", string(body))
}`;
  return snippet;
};

const generateJavaOkHttpSnippet = (
  snippet: string,
  url: String,
  method: String,
  headers: any,
  requestBody: any,
) => {
  snippet += `import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.MediaType;
import okhttp3.RequestBody;

public class Main {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    String url = "${url}";
    
    Request.Builder requestBuilder = new Request.Builder()
      .url(url)
      .${method.toLowerCase()}();`;

  // Add headers
  for (const [key, value] of Object.entries(headers)) {
    snippet += `
    requestBuilder.addHeader("${key}", "${value}");`;
  }

  // Add request body if provided
  if (requestBody) {
    snippet += `
    MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
    RequestBody body = RequestBody.create(mediaType, "${JSON.stringify(
      requestBody,
    )}");
    requestBuilder.method("${method}", body);`;
  }

  snippet += `
    
    Request request = requestBuilder.build();

    try (Response response = client.newCall(request).execute()) {
      if (response.isSuccessful()) {
        String responseData = response.body().string();
        // Handle the API response data here
        System.out.println(responseData);
      } else {
        // Handle errors here
        System.err.println("Error: " + response.code());
      }
    }
  }
}`;
  return snippet;
};

const generatePythonSnippet = (
  snippet: string,
  url: String,
  headers: any,
  method: String,
  requestBody: any,
) => {
  snippet += `import requests

url = '${url}'
headers = {
    ${Object.entries(headers)
      .map(([key, value]) => `'${key}': '${value}'`)
      .join(",\n    ")}
}

response = requests.${method.toLowerCase()}(url, headers=headers`;

  if (requestBody) {
    snippet += `,
json=${JSON.stringify(requestBody)}`;
  }

  snippet += `)

if response.status_code == 200:
    data = response.json()
    # Handle the API response data here
    print(data)
else:
    # Handle errors here
    print(f"Error: {response.status_code}")`;
  return snippet;
};

const generateJsSnippet = (
  snippet: string,
  url: String,
  method: String,
  headers: any,
  requestBody: any,
) => {
  snippet += `fetch('${url}', {
      method: '${method}',
      headers: {
        ${Object.entries(headers)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(",\n        ")}
      },
      ${requestBody ? `body: ${JSON.stringify(requestBody)},` : ""}
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });`;
  return snippet;
};

const generatePhpGuzzle = (
  snippet: string,
  url: String,
  headers: any,
  requestBody: any,
  method: String,
) => {
  snippet += `<?php
      use GuzzleHttp\Client;
      use GuzzleHttp\RequestOptions;
      
      $url = '${url}';
      $headers = [`;

  // Add headers
  for (const [key, value] of Object.entries(headers)) {
    snippet += `
        '${key}' => '${value}',`;
  }

  // Add request body if provided
  if (requestBody) {
    snippet += `
      ];
      $body = ${JSON.stringify(requestBody)};
      $client = new Client();
      $response = $client->request('${method}', $url, [
        'headers' => $headers,
        RequestOptions::JSON => $body,
      ]);
      
      if ($response->getStatusCode() == 200) {
        $data = json_decode($response->getBody(), true);
        // Handle the API response data here
        print_r($data);
      } else {
        // Handle errors here
        echo "Error: " . $response->getStatusCode();
      }
?>`;
  } else {
    snippet += `
      ];
      $client = new Client();
      $response = $client->request('${method}', $url, [
        'headers' => $headers,
      ]);
      
      if ($response->getStatusCode() == 200) {
        $data = json_decode($response->getBody(), true);
        // Handle the API response data here
        print_r($data);
      } else {
        // Handle errors here
        echo "Error: " . $response->getStatusCode();
      }
?>`;
  }
  return snippet;
};
