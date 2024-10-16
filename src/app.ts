import * as dotenv from 'dotenv'
import {router} from "./router/router";
import { createServer } from 'http';
dotenv.config()


export function startServer() {
    const PORT = process.env.PORT || 9000;
    const server = createServer(router.listen);

    server.listen(PORT);
}
