import type {IncomingMessage} from "http";
import {Validator} from "../validator";
import {Validation} from "../abstract-validation/validation";
import {REQUEST_ERRORS} from "../../constants/constants";

export class DeleteValidation extends Validation {
    constructor(request: IncomingMessage, validator: Validator) {
        super(request, validator);
        this.validate();
    }

    validate() {
        if (!this.uuid) {
            return this.setUuidError(REQUEST_ERRORS.UUID_DONT_EXIST);
        }
        this.isUuidValid(this.uuid);
        if (this.validator.getStringifyBody()) {
            return this.setError({
                message: REQUEST_ERRORS.BODY_EXIST,
                code: 400
            })
        }
    }
}
