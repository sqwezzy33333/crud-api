import type {IncomingMessage} from "http";
import {Validator} from "../validator";
import {REQUEST_ERRORS} from "../../constants/constants";
import {ValidationWitchBody} from "../abstract-validation/validation-with-body";

export class PutValidation extends ValidationWitchBody {
    constructor(request: IncomingMessage, validator: Validator) {
        super(request, validator);
        this.validate();
    }

    validate() {
        if (!this.uuid) {
            return this.setError({
                message: REQUEST_ERRORS.UUID_DONT_EXIST,
                code: 400,
            })
        }

        if (!this.isUuidValid(this.uuid)) {
            return this.setError({
                message: REQUEST_ERRORS.UUID_INCORRECT,
                code: 400,
            })
        }
        this.isUserValidation(this.uuid as string);
        this.validateJsonBody();
        this.validateBodyModel();
    }
}
