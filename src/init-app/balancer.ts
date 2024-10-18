import {initServer} from "./init-server";
import cluster from 'cluster';
import os from 'os';
import type {IncomingMessage, ServerResponse} from "http";
import * as http from "node:http";
import {router} from "../router/router";
import {Validator} from "../validator/validator";

class Balancer {
    private port = 9000;
    private numCPUs = 0;
    private currentWorkerId = 0;

    initApp() {
        process.setMaxListeners(0)
        this.numCPUs = os.cpus().length;

        if (cluster.isMaster) {
            console.log(`Master ${process.pid} is running`);

            for (let i = 0; i < this.numCPUs; i++) {
                cluster.fork();
            }
            initServer(this.port, this.proxyRequest);
            cluster.on('exit', cluster.fork);


        } else {
            const port = this.port + cluster!.worker!.id;
            initServer(port, (request: IncomingMessage, response: ServerResponse) => {
                let body = '';

                request.on('data', (chunk) => body += chunk);
                request.on('end', () => router.initHandlers(body, response, request));
            });
        }
    }

    proxyRequest = (request: IncomingMessage, response: ServerResponse) => {
        this.currentWorkerId++;
        if (this.currentWorkerId > this.numCPUs) {
            this.currentWorkerId = 0;
        }
        const workerPort = this.port + this.currentWorkerId;

        let body = '';

        request.on('data', (chunk) => body += chunk);
        request.on('end', async () => {
            const validator = new Validator(request).setStringifyBody(body);
            await validator.validateRequest();
            const validatorError = validator.getValidationError();
            if (validatorError) {
                router.sendErrorResponse(validatorError, response);
            } else {
                const workerServer = http.request({
                    hostname: 'localhost',
                    port: workerPort,
                    path: request.url,
                    method: request.method,
                    headers: request.headers,
                }, (workerRes) => {
                    workerRes.pipe(response);
                });

                request.pipe(workerServer);
            }
        });
    }

    setInitialPort(port: number) {
        this.port = port;
        return this;
    }
}

export const balancer = new Balancer();
