/* //import {SnifferManagerController} from '../../../traffic-sniffer/lib/sniffer-manager/sniffer-manager-controller';
import express, { Request, Express, Response, json } from "express";
//import request from "supertest";
import { SnifferConfigSetup } from '../../../traffic-sniffer/lib/setup-config/file-config.types';
import { SnifferManagerController } from '../../../traffic-sniffer/lib/sniffer-manager/sniffer-manager-controller';
import { MockManagerController } from '../../../traffic-sniffer/lib/sniffer-manager/mock-manager-controller';
import {SnifferManager} from '../../../traffic-sniffer/lib/sniffer-manager/sniffer-manager'
import {SnifferManagerServer} from '../../../traffic-sniffer/lib/sniffer-manager/sniffer-manager-server'
//import { ConfigLoader } from "../../../traffic-sniffer/lib/setup-config/config-loader-interface";
//import { SnifferConfig } from "../../../traffic-sniffer/lib/sniffer/sniffer";
import { FileConfig } from "../../../traffic-sniffer/lib/setup-config/file-config";
import { Sniffer, SnifferConfig } from "../../../traffic-sniffer/lib/sniffer/sniffer";
import { SwaggerUiController } from "../../../traffic-sniffer/lib/swagger/swagger-controller";

import { PathResponseData } from "../../../traffic-sniffer/types";
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; */
//import { getRequests, getSniffers } from "../../../traffic-dashbord/src/api/api";
import axios from 'axios';

export const getRequests = () => {
  return axios.get<PathResponseData>("http://localhost:5012/sharkio/sniffer/invocation");
};
/* export async function startHttp() {
    return new Promise<void>((resolve, reject) => {
        try {

            const app = express();
            const port = 3000;

            // Proxy middleware configuration
            const proxyOptions = {
                target: 'http://localhost:5012', // Replace with the target server URL
                changeOrigin: true,
            };

            // Proxy middleware
            const proxy = createProxyMiddleware('/sharkio', proxyOptions);

            // Apply the proxy middleware to all requests starting with /sharkio
            app.use(proxy);


            //const __filename = fileURLToPath(import.meta.url);
            //const __dirname = path.dirname(__filename);

            app.use(cors());
            //app.use(express.static(path.join(__dirname, '/dist')));

            app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, 'dist/index.html'))
            });

            app.listen(port, () => {
                console.log(`Server is running on http://localhost:${port}`);
                resolve();
            });
        }
        catch (e) {
            reject(e);
        }
    })
}
 */

export async function Actions(){

/*  	const conf: SnifferConfig = {
		name: "cli_snif",
		port: 5551,
		downstreamUrl: "http://localhost:5173/",
		id: '5551'
/* 	};  */
	
	/* const configPersistency = new FileConfig();
	const snifferManager = new SnifferManager(configPersistency);

	const configData: SnifferConfigSetup[] = await configPersistency.getSetup();
	await snifferManager.loadSniffersFromConfig(configData);

	const snifferController = new SnifferManagerController(snifferManager);
	const mockManagerController = new MockManagerController(snifferManager);
	const swaggerUi = new SwaggerUiController();
	
	const snifferManagerServer = await new SnifferManagerServer([
	snifferController,
	mockManagerController,
	swaggerUi,
	]);*/
    //await snifferManagerServer.start();
	
	// POST something to the server 
	await axios.post("http://localhost:5551");
	await axios.get<PathResponseData>("http://localhost:5012/sharkio/sniffer/invocation");
	await axios.get<PathResponseData>("http://localhost:5012/sharkio/sniffer/invocation");
	const answer = await axios.get<PathResponseData>("http://localhost:5012/sharkio/sniffer/invocation");
/* 	const answer = await Promise.all([
      getRequests()
    ]); */
	console.log(answer);
	return

	//console.log(snifferManager.getAllSniffers());
/* 	const answer = await Promise.all([
      getRequests()
    ]); */
/* 	const answer = await axios.get<PathResponseData>(
      '/sharkio/sniffer/invocation',
      {
        headers: {
           "Content-Type": 'application/json',
        },
      },
    ); */


	// });
/*     app.get("/sharkio/sniffer/invocation", (req: Request, res: Response) => {
      try {
        console.log(res.send(snifferManager.stats()).status(200));
      } catch (e) {
        res.sendStatus(500);
      }
    }); */
/* 	app.post("/sharkio/sniffer/invocation" ,function (_req: Express.Request, res: Express.Response) {
		console.log('vv');
		//return res;
	}); */
	
	


  
//	});

}