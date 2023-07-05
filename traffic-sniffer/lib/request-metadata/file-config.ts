import fs from 'fs'
import { SnifferConfig } from './sniffer/sniffer';

const setupFilePath = process.env.SETUP_FILE_PATH ?? './config/sniffers-setup.json'

export type SnifferConfigSetup = SnifferConfig & { isStarted: boolean }

export interface ConfigLoader {
    configData: SnifferConfigSetup[];

    getSetup(): SnifferConfigSetup[];
    update(existingId: string, newConfig: SnifferConfig, isStarted: boolean): void;
    addSniffer(snifferConfig: SnifferConfig): void;
    removeSniffer(port: number): void;
    setIsStarted(snifferId: string, isStarted: boolean):  void;
}

export class FileConfig implements ConfigLoader {
    configData: SnifferConfigSetup[];

    constructor() {
        this.validateSetupFileExists()
        this.configData = this.readSetupFileData();
    }

    getSetup() {
        return this.configData;
    }

    update(existingId: string, newConfig: SnifferConfig, isStarted: boolean) {
        const foundIndex = this.configData.findIndex((item) => item.id === existingId);   
        if (foundIndex === -1) {
          throw new Error("item was not found")
        }
        this.configData[foundIndex] = this.createSnifferSetup(newConfig, isStarted);
        this.writeToSetupFile()
      }
    
    validateSetupFileExists() {
        if (!fs.existsSync(setupFilePath)) {
            fs.writeFileSync(setupFilePath, JSON.stringify([]), { flag: 'w'});
            }
    }  
    

    readSetupFileData(): SnifferConfigSetup[] {
        let setupData: SnifferConfigSetup[] = []
        try {
            setupData = JSON.parse(fs.readFileSync(setupFilePath, "utf-8"));
        }
        catch (err) {
            throw new Error("setup file is not in right format!")
        }
        return setupData
    }

    addSniffer(snifferConfig: SnifferConfig) {
        const addedObj = this.createSnifferSetup(snifferConfig, false)
        const isListed = this.configData.findIndex((item) => item.id === snifferConfig.id )

        if (isListed !== -1) {
            console.log("sniffer already listed");
            return;
        }
        this.configData.push(addedObj)
        this.writeToSetupFile()
        
    }

    removeSniffer(port: number) {
        const foundIndex = this.configData.findIndex((item) => item.port === port);   
        if (foundIndex === -1) {
            throw new Error("item was not found") 
        }
        this.configData.splice(foundIndex, 1);
        this.writeToSetupFile()

    }

    setIsStarted(snifferId: string, isStarted: boolean) {
        const foundIndex = this.configData.findIndex((item) => item.id === snifferId);   
        if (foundIndex === -1) {
          throw new Error("item was not found")
        }
        const updatedSetup = this.configData[foundIndex];
        updatedSetup.isStarted = isStarted
        this.configData[foundIndex] = updatedSetup;
        this.writeToSetupFile()
    }

    writeToSetupFile() {
        fs.writeFile(setupFilePath, JSON.stringify(this.configData), (err) => {
            if(err) { throw new Error("unable to update setup file"); }
        })
    }

    createSnifferSetup(snifferConfig: SnifferConfig, isStarted: boolean): SnifferConfigSetup {
        return {
            id: snifferConfig.id,
            name: snifferConfig.name,
            downstreamUrl: snifferConfig.downstreamUrl,
            port: snifferConfig.port,
            isStarted: isStarted
        }
    }
}
