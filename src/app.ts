import * as dotenv from 'dotenv'
import {parseArgs} from "./utils/utils";
import {balancer, initServer} from "./init-app";
import * as process from "node:process";

dotenv.config();

export function startServerApplication() {
    const PORT_FROM_ENV = +process.env!.PORT! as number;
    const PORT = PORT_FROM_ENV || 9000;
    const args = parseArgs();
    if(args.mode === "multi") {
      return balancer.setInitialPort(PORT).initApp();
    }
    initServer(PORT);
}

