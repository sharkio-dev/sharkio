import { MockResponse } from "./../../model/entities/MockResponse";
import HandleBars from "handlebars";
import { faker } from "@faker-js/faker";
import { parse } from "json5";

export class MockResponseTransformer {
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
  }

  parseParams(params: string) {
    try {
      return parse(params);
    } catch (ex) {
      return null;
    }
  }

  transform(
    response: MockResponse,
    context?: {
      body: any;
      headers: any;
      url: string;
      method: string;
      params: any;
      query: any;
    },
  ) {
    let body, headers;
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

    return { ...response, body, headers };
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
