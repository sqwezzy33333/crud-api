import type { IncomingMessage, ServerResponse } from 'http';

class ServerListener {

    listen = (req: IncomingMessage, res: ServerResponse) => {

        console.log(req, res)
    }

}

export const serverListener = new ServerListener();
