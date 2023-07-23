import express, { Express, json } from "express";
import request from "supertest";
import { SnifferManager, SnifferManagerController } from "../../../lib";
import { ConfigLoader } from "../../../lib/setup-config/config-loader-interface";
import { SnifferConfigSetup } from "../../../lib/setup-config/file-config.types";
import { SnifferConfig } from "../../../lib/sniffer/sniffer";
import { FileConfig } from "../../../lib/setup-config/file-config";

jest.mock("../../../lib/setup-config/file-config", () => {
  class MockFileConfig implements ConfigLoader {
    configData: SnifferConfigSetup[];

    constructor(configData: SnifferConfigSetup[]) {
      this.configData = configData;
    }

    getConfig(): SnifferConfigSetup[] {
      return this.configData;
    }

    update(
      existingId: string,
      newConfig: SnifferConfig,
      isStarted: boolean,
    ): void {}

    addSniffer(snifferConfig: SnifferConfig): void {
      this.configData.push({ ...snifferConfig, isStarted: false });
    }

    removeSniffer(port: number): void {
      const index = this.configData.findIndex((sniffer) => {
        return sniffer.port === port;
      });

      if (index !== -1) {
        this.configData = [
          ...this.configData.slice(0, index),
          ...this.configData.slice(index + 1),
        ];
      }
    }

    setIsStarted(snifferId: string, isStarted: boolean): void {
      const sniffer = this.configData.find((sniffer) => {
        return sniffer.id === snifferId;
      });
      if (sniffer) {
        sniffer.isStarted = isStarted;
      }
    }
  }
  return { FileConfig: MockFileConfig };
});

describe("sniffer-manager-controller", () => {
  let app: Express;
  let configPersistency: ConfigLoader;
  let snifferManager: SnifferManager;
  let snifferManagerController: SnifferManagerController;

  beforeAll(() => {
    app = express();
    app.use(json());
    configPersistency = new FileConfig("");
    snifferManager = new SnifferManager(configPersistency);
    snifferManagerController = new SnifferManagerController(snifferManager);
    snifferManagerController.setup(app);
  });

  it("should exist", async () => {
    expect(snifferManagerController).toBeDefined();
  });

  describe("when attempting to add a sniffer", () => {
    it("should add sniffer", async () => {
      const snifferConfig: SnifferConfig = {
        downstreamUrl: "http://localhost:5173",
        port: 5555,
        id: "id",
        name: "sharkio",
      };

      const response = await request(app)
        .post("/sharkio/sniffer")
        .set("Content-Type", "application/json")
        .send(snifferConfig);

      expect(response.status).toEqual(201);
      expect(snifferManager.getAllSniffers().length).toEqual(1);
    });

    it("should not add a sniffer whose port is already taken", async () => {
      const snifferConfig: SnifferConfig = {
        downstreamUrl: "http://localhost:5173",
        port: 5555,
        id: "id",
        name: "sharkio",
      };

      const response = await request(app)
        .post("/sharkio/sniffer")
        .set("Content-Type", "application/json")
        .send(snifferConfig);

      expect(response.status).toEqual(500);
    });
  });

  describe("when attempting to retrieve a sniffer", () => {
    it.skip("should retrieve a sniffer when it exists", async () => {
      const response = await request(app)
        .get("/5555")
        .set("Content-Type", "application/json")
        .send();

      expect(response.status).toEqual(200);
    });

    it("should return 404 when sniffer doesn't exist", async () => {
      const response = await request(app)
        .get("/5550")
        .set("Content-Type", "application/json")
        .send();

      expect(response.status).toEqual(404);
    });
  });

  describe("when attempting to stop a sniffer", () => {
    it("should start a sniffer that exists", async () => {
      const response = await request(app)
        .get("/5555/actions/start")
        .set("Content-Type", "application/json")
        .send();

      expect(response.status).toEqual(200);
    });

    it("should return 404 if a sniffer doesn't exist", async () => {
      const response = await request(app)
        .get("/5550/actions/start")
        .set("Content-Type", "application/json")
        .send();

      expect(response.status).toEqual(404);
    });
  });

  describe("when attempting to start a sniffer", () => {});

  describe("when attempting to remove a sniffer", () => {
    it("should remove a sniffer that already exists", async () => {
      const response = await request(app)
        .delete("/sharkio/sniffer/5555")
        .set("Content-Type", "application/json")
        .send();

      expect(response.status).toEqual(200);
    });

    it("should not remove a sniffer that doesn't exist", async () => {
      const response = await request(app)
        .delete("/sharkio/sniffer/5555")
        .set("Content-Type", "application/json")
        .send();

      expect(response.status).toEqual(404);
    });
  });

  describe("when attempting to modify a sniffer", () => {
    it("should modify the sniffer", () => {});

    it("should throw an error in case the sniffer doesn't exist", async () => {});
  });
});
