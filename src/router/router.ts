import type {IncomingMessage, ServerResponse} from 'http';
import {Validator} from "../validator/validator";
import {ValidationRequestError} from "../models/models";

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

        this.sendSuccessResponse(response);
    }

    sendSuccessResponse = (response: ServerResponse) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end('Success')
    }

    sendErrorResponse(error: ValidationRequestError, response: ServerResponse) {
        response.statusCode = error.code;
        response.setHeader('Content-Type', 'text/plain');
        response.end(error.message);
    }

}

export const router = new Router();
