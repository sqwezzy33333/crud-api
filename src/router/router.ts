import type {IncomingMessage, ServerResponse} from 'http';
import {Validator} from "../validator/validator";
import {ValidationRequestError} from "../models/models";
import {METHODS} from "../constants/constants";
import {deleteHandler, getHandler, postHandler, putHandler} from "../handlers";

class Router {

    listen = (request: IncomingMessage, response: ServerResponse) => {
        let body = '';

        request.on('data', (chunk) => body += chunk);
        request.on('end', () => this.startValidation(request, response, body));
    }

    async startValidation(request: IncomingMessage, response: ServerResponse, body: string, callback = (validatorError: ValidationRequestError) => {}) {
        const validator = new Validator(request).setStringifyBody(body);
        await validator.validateRequest();
        const validatorError = validator.getValidationError();
        if (validatorError) {
            callback(validatorError)
            return this.sendErrorResponse(validatorError, response);
        }
        await this.initHandlers(body, response, request);
    }

    initHandlers(body: string, response: ServerResponse, request: IncomingMessage) {
        response.setHeader('Content-Type', 'application/json');
        switch (request.method) {
            case METHODS.post:
                return postHandler(body, response)
            case METHODS.put:
                return putHandler(body, response, request.url as string)
            case METHODS.delete:
                return deleteHandler(response, request.url as string)
            case METHODS.get:
                return getHandler(response, request.url as string)
        }
    }

    sendErrorResponse(error: ValidationRequestError, response: ServerResponse) {
        response.writeHead(error.code, {'Content-Type': 'text/plain'});
        return response.end(error.message);
    }

}

export const router = new Router();
