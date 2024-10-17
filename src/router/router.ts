import type {IncomingMessage, ServerResponse} from 'http';
import {Validator} from "../validator/validator";
import {PostPutUser, ValidationRequestError} from "../models/models";
import {METHODS} from "../constants/constants";
import {deleteHandler, getHandler, postHandler, putHandler} from "../handlers";

class Router {

    listen = (request: IncomingMessage, response: ServerResponse) => {
        let body = '';

        request.on('data', (chunk) => body += chunk);
        request.on('end', () => this.startValidation(request, response, body))
    }

    startValidation(request: IncomingMessage, response: ServerResponse, body: string) {
        const validator = new Validator(request).setStringifyBody(body).validateRequest();
        const validatorError = validator.getValidationError();

        if (validatorError) {
            return this.sendErrorResponse(validatorError, response);
        }
        this.initHandlers(body, response, request);
    }

    initHandlers(body: string, response: ServerResponse, request: IncomingMessage) {
        response.setHeader('Content-Type', 'application/json');
        switch (request.method) {
            case METHODS.post: return postHandler(body, response)
            case METHODS.put: return putHandler(body, response, request.url as string)
            case METHODS.delete: return deleteHandler(response, request.url as string)
            case METHODS.get: return getHandler(response, request.url as string)
        }
    }

    sendErrorResponse(error: ValidationRequestError, response: ServerResponse) {
        response.statusCode = error.code;
        response.setHeader('Content-Type', 'text/plain');
        response.end(error.message);
    }

}

export const router = new Router();
