import * as dotenv from 'dotenv'
import {serverListener} from "./server-listener/server-listener";
import { createServer } from 'http';
dotenv.config()


export function startServer() {
    const PORT = process.env.PORT || 9000;
    const server = createServer(serverListener.listen);

    server.listen(PORT);
}
