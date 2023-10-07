import { requestValidator } from "../../../lib/request-validator";
import { z } from "zod";
import express, { Request, Response, Send } from "express";

describe("request-validator", () => {
  describe("validator creation", () => {
    it("should allow us to create a validator with an empty object", () => {
      const validator = requestValidator({});
      expect(validator).toBeDefined();
    });

    it("should allow us to create a validator with params checking only", () => {
      const validator = requestValidator({ params: z.any() });
      expect(validator).toBeDefined();
    });

    it("should allow us to create a validator with body checking only", () => {
      const validator = requestValidator({ body: z.any() });
      expect(validator).toBeDefined();
    });
  });

  describe("validation behavior", () => {
    it("should allow us to pass an object freely when no validation is expected", () => {
      let pass = false;
      const validator = requestValidator({});
      const request = Object.create(express.request) as Request;
      const response = Object.create(express.response) as Response;

      validator(request, response, () => {
        pass = true;
      });
      expect(pass).toStrictEqual(true);
    });

    it("should allow us to pass to the next middleware if the object is passing the checks", () => {
      let pass = false;
      const validator = requestValidator({
        params: z.object({
          a: z.string(),
        }),
        body: z.number(),
      });
      const request = Object.create(express.request) as Request;
      request.params = { a: "7" };
      request.body = 7;
      const response = Object.create(express.response) as Response;

      validator(request, response, () => {
        pass = true;
      });
      expect(pass).toStrictEqual(true);
    });

    it("should fail if the validations do not pass", () => {
      let pass = true;
      const validator = requestValidator({
        params: z.object({
          a: z.string(),
        }),
        body: z.number(),
      });
      const request = Object.create(express.request) as Request;
      request.params = { a: "7" };
      request.body = undefined;
      const response = Object.create(express.response) as Response;
      response.send = jest.fn();

      validator(request, response, () => {
        pass = false;
      });
      expect(pass).toStrictEqual(true);
      expect(response.statusCode).toStrictEqual(400);
    });
  });
});
