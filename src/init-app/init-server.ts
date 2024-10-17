import {createServer} from "http";
import {router} from "../router/router";

export function initServer(port: number, listener = router.listen) {
    const server = createServer(listener);
    server.listen(port);
    server.on('listening', () => {
        console.log(`Server listening on ${port}`)
    })
}
