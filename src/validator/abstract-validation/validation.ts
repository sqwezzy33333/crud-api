import type {IncomingMessage} from "http";
import {validate as uuidValidate} from "uuid";
import {DEFAULT_PATH, REQUEST_ERRORS} from "../../constants/constants";
import {PostPutUser, ValidationRequestError} from "../../models/models";
import {Validator} from "../validator";
import {subtractArrays} from "../../utils/utils";

export class Validation {
    url = '';

    constructor(protected request: IncomingMessage, protected validator: Validator) {
        this.getUrl();
    }

    getUrl() {
        this.url = this.request.url?.trim() as string;
    }

    isUuidValid(uuidFromRequest: string) {
        const isUuidValid = uuidValidate(uuidFromRequest);
        if (!isUuidValid) {
            this.setUuidError();
            return false;
        }
        return true;
    }

    setUuidError(error = REQUEST_ERRORS.UUID_INCORRECT) {
        this.setError({
            message: error,
            code: 400
        })
    }

    setError(error: ValidationRequestError) {
        this.validator.setValidationError(error);
    }

    get uuid(): string | null {
        return this.url.replace(DEFAULT_PATH, '').split('/')[1] || null;
    }
}
