import type {IncomingMessage} from "http";
import {Validator} from "../validator";
import {Validation} from "../abstract-validation/validation";
import {REQUEST_ERRORS} from "../../constants/constants";

export class DeleteValidation extends Validation {
    constructor(request: IncomingMessage, validator: Validator) {
        super(request, validator);
    }

    async validate() {
        if (!this.uuid) {
            return this.setUuidError(REQUEST_ERRORS.UUID_DONT_EXIST);
        }
        this.isUuidValid(this.uuid);
        await this.isUserValidation(this.uuid as string);
        if (this.validator.getStringifyBody()) {
            return this.setError({
                message: REQUEST_ERRORS.BODY_EXIST,
                code: 400
            })
        }
    }
}
