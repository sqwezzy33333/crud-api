import type {IncomingMessage} from "http";
import {validate as uuidValidate} from "uuid";
import {Validator} from "../validator";
import {getUuid} from "../../utils/utils";
import {REQUEST_ERRORS} from "../../constants/constants";
import {ValidationRequestError} from "../../models/models";
import {storage} from "../../storage/storage";

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

    async isUserValidation(uuid: string) {
       if(this.validator.isInvalid) {
           return
       }

       if(!(await storage.isUser(uuid))) {
           return this.setError({
               message: REQUEST_ERRORS.USER_NOT_FOUND,
               code: 404,
           });
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
        return getUuid(this.url);
    }
}
