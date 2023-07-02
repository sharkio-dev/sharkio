import fs from 'fs'
import { SnifferConfig } from './sniffer/sniffer';

const setupFilePath = process.env.SETUP_FILE_PATH ?? './config/sniffers-setup.json'


export class SetupFile {
    private setupData: SnifferConfig[]; 

    constructor() {
        this.validateSetupFileExists()
        this.setupData = this.readSetupFileData();
    }

    getSetup() {
        return this.setupData;
    }

    updateSetupFile(existingId: string, newConfig: SnifferConfig) {
        const foundIndex = this.setupData.findIndex((item) => item.id === existingId);   
        if (foundIndex === -1) {
          throw new Error("item was not found")
        }
        this.setupData[foundIndex] = newConfig;
        fs.writeFileSync(setupFilePath, JSON.stringify(this.setupData))
      }
    
      validateSetupFileExists() {
        if (!fs.existsSync(setupFilePath)) {
          fs.writeFileSync(setupFilePath, JSON.stringify([]), { flag: 'w'});
        }  
      }
    
      readSetupFileData() {
        this.validateSetupFileExists
        const setupData: SnifferConfig[] = JSON.parse(fs.readFileSync(setupFilePath, "utf-8"));
        return setupData;    
      }
    
      addSnifferToSetupFile(snifferConfig: SnifferConfig) {
        if (this.setupData.indexOf(snifferConfig) === -1) {
          this.setupData.push(snifferConfig)
          fs.writeFileSync(setupFilePath, JSON.stringify(this.setupData))
        }
        else {
          console.log("sniffer already listed");
        }
      }
    
      removeSnifferFromSetupFile(port: number) {
        const foundIndex = this.setupData.findIndex((item) => item.port === port);   
        if (foundIndex === -1) {
          throw new Error("item was not found")
        }
        this.setupData.splice(foundIndex, 1);
        fs.writeFileSync(setupFilePath, JSON.stringify(this.setupData))
      }
}