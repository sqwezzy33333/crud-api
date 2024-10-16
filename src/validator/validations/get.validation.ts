import type {IncomingMessage} from "http";
import {Validator} from "../validator";
import {Validation} from "../abstract-validation/validation";

export class GetValidation extends Validation {
    constructor( request: IncomingMessage, validator: Validator) {
        super(request, validator);
        this.validate();
    }

    validate() {
        if(!this.uuid) {
            return;
        }
        this.isUuidValid(this.uuid);
    }
}
