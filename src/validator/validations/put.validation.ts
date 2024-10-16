import type {IncomingMessage} from "http";
import {Validator} from "../validator";
import {REQUEST_ERRORS} from "../../constants/constants";
import {ValidationWitchBody} from "../abstract-validation/validation-with-body";
import {storage} from "../../storage/storage";

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

        if (!storage.isUser(this.uuid)) {
            return this.setError({
                message: REQUEST_ERRORS.USER_NOT_FOUND,
                code: 404,
            })
        }

        this.validateJsonBody();
        this.validateBodyModel();
    }
}
