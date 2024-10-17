import type {IncomingMessage} from "http";
import {Validator} from "../validator";
import {Validation} from "../abstract-validation/validation";
import {REQUEST_ERRORS} from "../../constants/constants";

export class GetValidation extends Validation {
    constructor(request: IncomingMessage, validator: Validator) {
        super(request, validator);
    }

    async validate() {
        if (this.validator.getStringifyBody()) {
            return this.setError({
                message: REQUEST_ERRORS.BODY_EXIST,
                code: 400
            })
        }
        if (this.uuid) {
            this.isUuidValid(this.uuid);
            await this.isUserValidation(this.uuid);
        }
    }
}
