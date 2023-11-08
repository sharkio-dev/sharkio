import {
  InterceptedRequest,
  generateOpenApi,
} from "../../../../services/code-generator/open-api-generator";

describe("open api generator", () => {
  it("should generate basic swagger", () => {
    const requests: InterceptedRequest[] = [
      {
        id: "asdf",
        method: "GET",
        snifferId: "",
        url: "/hello-world",
        invocations: [
          {
            id: "sadasde",
            headers: {
              "user-agent": "PostmanRuntime/7.34.0",
              accept: "*/*",
              "postman-token": "f25d07c0-4daf-4ed1-b483-1d6ae17555b5",
              host: "e20da1c0-a96d-4177-addb-3d5e73583d19.localhost.sharkio.dev",
              "accept-encoding": "gzip, deflate, br",
              connection: "keep-alive",
            },
            body: {
              "user-agent": "PostmanRuntime/7.34.0",
              accept: "*/*",
              "postman-token": "f25d07c0-4daf-4ed1-b483-1d6ae17555b5",
              host: "e20da1c0-a96d-4177-addb-3d5e73583d19.localhost.sharkio.dev",
              "accept-encoding": "gzip, deflate, br",
              connection: "keep-alive",
            },
            method: "GET",
            params: {},
            response: {
              id: "",
              headers: {
                "user-agent": "PostmanRuntime/7.34.0",
                accept: "*/*",
                "postman-token": "f25d07c0-4daf-4ed1-b483-1d6ae17555b5",
                host: "e20da1c0-a96d-4177-addb-3d5e73583d19.localhost.sharkio.dev",
                "accept-encoding": "gzip, deflate, br",
                connection: "keep-alive",
              },
              body: {
                "user-agent": "PostmanRuntime/7.34.0",
                accept: "*/*",
                "postman-token": "f25d07c0-4daf-4ed1-b483-1d6ae17555b5",
                host: "e20da1c0-a96d-4177-addb-3d5e73583d19.localhost.sharkio.dev",
                "accept-encoding": "gzip, deflate, br",
                connection: "keep-alive",
              },
              params: {},
              status: 200,
              timestamp: new Date().toISOString(),
              method: "GET",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      },
    ];

    const swagger = generateOpenApi(requests);
    console.log(swagger);
  });
});
