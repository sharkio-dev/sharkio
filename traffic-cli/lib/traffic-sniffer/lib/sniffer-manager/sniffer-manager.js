"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnifferManager = void 0;
const sniffer_1 = require("../sniffer/sniffer");
class SnifferManager {
    configPersistency;
    sniffers;
    constructor(configPersistency) {
        this.configPersistency = configPersistency;
        this.sniffers = [];
    }
    createSniffer(snifferConfig) {
        const sniffer = this.getSniffer(+snifferConfig.port);
        if (sniffer !== undefined) {
            throw new Error("Sniffer with the same port already exists");
        }
        const newSniffer = new sniffer_1.Sniffer(snifferConfig);
        this.sniffers.push(newSniffer);
        this.configPersistency.addSniffer(snifferConfig);
        return newSniffer;
    }
    getSniffer(port) {
        const res = this.sniffers.find((sniffer) => {
            return sniffer.getPort() === port;
        });
        return res;
    }
    async stats() {
        let stats = [];
        await this.sniffers.forEach((sniffer) => {
            stats.push(...sniffer.stats().interceptedRequests);
        });
        return stats;
    }
    getAllSniffers() {
        return this.sniffers;
    }
    removeSniffer(port) {
        const index = this.sniffers.findIndex((sniffer) => {
            return sniffer.getPort() === port;
        });
        if (this.sniffers[index].getIsStarted() === true) {
            throw new Error("Cannot remove an active sniffer");
        }
        this.sniffers.splice(index, 1);
        this.configPersistency.removeSniffer(port);
    }
    getSnifferById(id) {
        const res = this.sniffers.find((sniffer) => {
            return sniffer.getId() === id;
        });
        return res;
    }
    async editSniffer(existingId, newConfig) {
        const existingIndex = this.sniffers.findIndex((sniffer) => {
            return sniffer.getId() === existingId;
        });
        // Not needed if we stop the sniffer beforehand
        if (this.sniffers[existingIndex].getIsStarted() === true) {
            throw new Error("Cannot edit an active sniffer");
        }
        await this.sniffers[existingIndex].editSniffer(newConfig);
        this.configPersistency.update(existingId, newConfig, this.sniffers[existingIndex].getIsStarted());
    }
    async loadSniffersFromConfig(configPersistency) {
        if (configPersistency.length !== 0) {
            configPersistency.forEach(async (item) => {
                const sniffer = this.createSniffer(item);
                if (item.isStarted) {
                    await sniffer.start();
                }
            });
        }
    }
    setSnifferConfigToStarted(snifferId, isStarted) {
        this.configPersistency.setIsStarted(snifferId, isStarted);
    }
    getAllMocks() {
        return this.sniffers.map((sniffer) => {
            return {
                service: {
                    name: sniffer.getConfig().name,
                    port: sniffer.getConfig().port,
                },
                mocks: sniffer.getMockManager().getAllMocks(),
            };
        });
    }
}
exports.SnifferManager = SnifferManager;
