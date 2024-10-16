import type {IncomingMessage} from "http";
import {Validator} from "../validator";
import {REQUEST_ERRORS} from "../../constants/constants";
import {ValidationWitchBody} from "../abstract-validation/validation-with-body";

export class PostValidation extends ValidationWitchBody {
    constructor(request: IncomingMessage, validator: Validator) {
        super(request, validator);
        this.validate();
    }

    validate() {
        if (this.uuid) {
            return this.setError({
                message: REQUEST_ERRORS.UUID_EXIST,
                code: 400,
            })
        }
        this.validateJsonBody();
        this.validateBodyModel();
    }
}
