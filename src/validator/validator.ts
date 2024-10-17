import type {IncomingMessage} from "http";
import {AVAILABLE_METHODS, DEFAULT_PATH, METHODS, REQUEST_ERRORS} from "../constants/constants";
import {Method, ValidationRequestError} from "../models/models";
import {DeleteValidation, GetValidation, PostValidation, PutValidation} from "./validations";

export class Validator {
    private validationError: ValidationRequestError | null = null;
    private url = '';
    private stringifyBody = '';

    constructor(private request: IncomingMessage) {
        this.getUrl();
    }

    getStringifyBody() {
        return this.stringifyBody;
    }

    get isInvalid(): boolean {
        return !!this.validationError;
    }

    getUrl() {
        this.url = this.request.url?.trim() as string;
    }

    setStringifyBody(body: string) {
        this.stringifyBody = body;
        return this;
    }

    getValidationError() {
        return this.validationError;
    }

    setValidationError(error: ValidationRequestError) {
        this.validationError = error;
    }

    validateRequest() {
        this.defaultPathValidator();
        this.validateByRequestMethod();
        return this;
    }

    validateByRequestMethod() {
        if (this.validationError) {
            return
        }
        const method = this.request.method as Method;

        switch (method) {
            case METHODS.get :
                return new GetValidation(this.request, this);
            case METHODS.post:
                return new PostValidation(this.request, this);
            case METHODS.put:
                return new PutValidation(this.request, this);
            case METHODS.delete:
                return new DeleteValidation(this.request, this);
        }
    }

    defaultPathValidator() {
        if (
            this.isMethodAvailable() &&
            this.includeDefaultPath() &&
            this.validPathLength() &&
            this.validAfterReplaceDefaultPath()
        ) {
            return;
        }

        this.validationError = {
            message: REQUEST_ERRORS.NOT_FOUND,
            code: 404
        }
    }
    isMethodAvailable = () => AVAILABLE_METHODS.includes(this.request.method as string);
    includeDefaultPath = () => this.url.includes(DEFAULT_PATH);
    validPathLength = () => this.url.split('/').length < 4;
    validAfterReplaceDefaultPath = () => this.url.replace(DEFAULT_PATH, '').startsWith('/') || !this.url.replace(DEFAULT_PATH, '');
}
