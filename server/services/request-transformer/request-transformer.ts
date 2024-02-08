import { faker } from "@faker-js/faker";
import HandleBars from "handlebars";
import { parse } from "json5";
import { MockResponse } from "../../model/entities/MockResponse";
import { TestFlowNodeRun } from "../../model/entities/test-flow/TestFlowNodeRun";
import {
  ExecutionContext,
  ExecutionResult,
} from "../test-flow/test-flow-executor/sequence-executor";

export type MockTransformerContext = {
  body: any;
  headers: any;
  url: string;
  method: string;
  params: any;
  query: any;
};

export type TestFlowTransformerContext = Record<
  TestFlowNodeRun["id"],
  ExecutionResult
>;

export type TransformContext =
  | MockTransformerContext
  | TestFlowTransformerContext;

export type InputResponse = {
  body: string;
  headers: Record<string, string>;
  status: number;
};

export type InputRequest = {
  body: string;
  headers: Record<string, string>;
  method: string;
  url: string;
};

export class RequestTransformer {
  constructor(private readonly handleBars = HandleBars.create()) {
    this.handleBars.registerHelper(
      "faker",
      ((...args: any[]) => {
        try {
          const funcName = args[0];
          const f = funcName.split(".");
          const baseFunc = f[0];
          const funcArgs = f[1].split("(");
          const slicedArgs = funcArgs[1]?.slice(0, -1) ?? null;
          const parsedParams = this.parseParams(slicedArgs);
          const subFuncArgs = parsedParams == null ? undefined : parsedParams;
          const subFunc = funcArgs[0];

          //@ts-ignore
          const res = faker[baseFunc][subFunc](subFuncArgs);
          return res;
        } catch (e) {
          return "fakerError";
        }
      }).bind(this),
    );
    this.handleBars.registerHelper("compare", this.compareFunction);
    this.handleBars.registerHelper("repeat", this.repeatHelper.bind(this));
    this.handleBars.registerHelper(
      "raw",
      function (this: typeof HandleBars, options: any) {
        return options.fn(this);
      }.bind(this.handleBars),
    );
  }

  parseParams(params: string) {
    try {
      return parse(params);
    } catch (ex) {
      return null;
    }
  }

  transformRequest(request: Partial<InputRequest>, context?: ExecutionContext) {
    let body, headers, method, url;
    try {
      body = this.handleBars.compile(request.body)(context);
    } catch (e) {
      body = "transformation error";
    }
    try {
      method = this.handleBars.compile(request.method)(context);
    } catch (e) {
      method = "transformation error";
    }
    try {
      url = this.handleBars.compile(request.url)(context);
    } catch (e) {
      url = "transformation error";
    }
    try {
      headers = JSON.parse(
        this.handleBars.compile(JSON.stringify(request.headers))(context),
      ) as MockResponse["headers"];
    } catch (e) {
      headers = { "x-sharkio-error": "header transformation error" };
    }

    return { ...request, body, headers, method, url };
  }

  transformResponse(response: MockResponse, context?: TransformContext) {
    let body, headers, status;
    try {
      body = this.handleBars.compile(response.body)(context);
    } catch (e) {
      body = "transformation error";
    }
    try {
      headers = JSON.parse(
        this.handleBars.compile(JSON.stringify(response.headers))(context),
      ) as MockResponse["headers"];
    } catch (e) {
      headers = { "x-sharkio-error": "header transformation error" };
    }

    try {
      status = +this.handleBars.compile(`${response.status}`)(context);
    } catch (e) {
      status = 500;
    }

    return { ...response, body, headers, status };
  }

  transformAssertion(expectedValue: any, context: ExecutionContext) {
    try {
      const res = this.handleBars.compile(expectedValue)(context);
      return res;
    } catch (e) {
      return "transformation error";
    }
  }

  repeatHelper() {
    var args = arguments;

    var options = args[args.length - 1];
    var hash = options.hash || {};
    var count = hash.count || args[0] || 0;
    var start = 1;
    var step = 1;
    var data = { count, start, step };

    if (
      typeof args[0] === "string" &&
      Number.isNaN(args[0]) &&
      args[0] !== ""
    ) {
      return this.repeat(data, args[0]);
    }

    if (data.count > 0) {
      return this.repeatBlock(data, this, options);
    }

    return options.inverse(this);
  }

  repeat(
    { count, start, step }: { count: number; start: number; step: number },
    thisArg: any,
  ) {
    const max = count * step + start;
    let index = start;
    let str = "";

    while (index < max) {
      str += thisArg;
      index += step;
    }
    return str;
  }

  repeatBlock(
    { count, start, step }: { count: number; start: number; step: number },
    thisArg: any,
    options: any,
  ) {
    let max = count * step + start;
    let index = start;
    let str = "";

    do {
      const data = {
        index,
        count,
        start,
        step,
        first: index === start,
        last: index >= max - step,
      };
      const blockParams = [index, data];
      str += options.fn(thisArg, { data, blockParams });
      index += data.step;
    } while (index < max);

    return str;
  }

  compareFunction(lvalue: any, operator: string, rvalue: any, options: any) {
    if (arguments.length < 3)
      throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    const operators = {
      "==": function (l: any, r: any) {
        return l == r;
      },
      "===": function (l: any, r: any) {
        return l === r;
      },
      "!=": function (l: any, r: any) {
        return l != r;
      },
      "<": function (l: any, r: any) {
        return l < r;
      },
      ">": function (l: any, r: any) {
        return l > r;
      },
      "<=": function (l: any, r: any) {
        return l <= r;
      },
      ">=": function (l: any, r: any) {
        return l >= r;
      },
      typeof: function (l: any, r: any) {
        return typeof l == r;
      },
    };

    //@ts-ignore
    let result = operators[operator](lvalue, rvalue);

    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }
}
