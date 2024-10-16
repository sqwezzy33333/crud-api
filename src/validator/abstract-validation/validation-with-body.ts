import type {IncomingMessage} from "http";
import {Validator} from "../validator";
import {REQUEST_ERRORS} from "../../constants/constants";
import {subtractArrays} from "../../utils/utils";
import {Validation} from "./validation";

export class ValidationWitchBody extends Validation {

    constructor(request: IncomingMessage, validator: Validator) {
        super(request, validator);
    }

    validateJsonBody() {
        if (this.validator.isInvalid) {
            return;
        }

        const stringifyBody = this.validator.getStringifyBody();
        if (!stringifyBody) {
            return this.setError({
                message: REQUEST_ERRORS.BODY_DONT_EXIST,
                code: 400
            });
        }

        try {
            JSON.parse(stringifyBody);
        } catch (e) {
            this.setError({
                message: REQUEST_ERRORS.BODY_INVALID_JSON,
                code: 400
            })
        }
    }

    validateBodyModel() {
        if (this.validator.isInvalid) {
            return;
        }
        const body = JSON.parse(this.validator.getStringifyBody());

        if (typeof body !== 'object' || Array.isArray(body)) {
            return this.setError({
                message: REQUEST_ERRORS.BODY_NOT_OBJECT,
                code: 400
            })
        }

        const availableKeys = ['username', 'age', 'hobbies'];
        const bodyKeys = Object.keys(body);
        this.validateBodyKeys(bodyKeys, availableKeys);
        this.validateBodyValues(body);
    }

    validateBodyValues(body: Record<any, any>) {
        for (const key in body) {
            if (this.validator.isInvalid) {
                return;
            }

            const value = body[key];

            if (!value) {
                return this.setEmptyFieldError(key);
            }

            if (key === 'username') this.usernameValidation(value);
            if (key === 'age') this.ageValidation(value);
            if (key === 'hobbies') this.hobbiesValidation(value);
        }
    }

    validateBodyKeys(bodyKeys: string[], availableKeys: string[]) {
        if (bodyKeys.length > availableKeys.length) {
            const unexpectedKey = subtractArrays(bodyKeys, availableKeys);
            return this.setError({
                message: REQUEST_ERRORS.BODY_UNEXPECTED_KEY + unexpectedKey[0],
                code: 400
            })
        }

        if (bodyKeys.length < availableKeys.length) {
            const unexpectedKey = subtractArrays(availableKeys, bodyKeys);
            return this.setError({
                message: REQUEST_ERRORS.BODY_EXPECTED_KEY + unexpectedKey[0],
                code: 400
            })
        }
    }

    ageValidation = (age: any) => {
        const type = typeof age;
        if (type === 'number') {
            return
        }
        this.setIncorrectFieldType('age', type, 'number');
    }

    hobbiesValidation = (hobbies: any) => {
        if (!Array.isArray(hobbies)) {
            return this.setIncorrectFieldType('hobbies', typeof hobbies, 'string[]');
        }

        const isArrayOfString = hobbies.every((item: any) => typeof item === 'string');
        if(!isArrayOfString) {
            return this.setIncorrectFieldType('hobbies', 'any[]', 'string[]');
        }
    }

    usernameValidation = (userName: any) => {
        const type = typeof userName;
        if (type === 'string') {
            return
        }
        this.setIncorrectFieldType('username', type, 'string');
    }

    setEmptyFieldError(field: string) {
        this.setError({
            message: REQUEST_ERRORS.BODY_INCORRECT_FIELD_VALUE + field,
            code: 400
        })
    }

    setIncorrectFieldType(field: string, type: string, expected: string) {
        const message = REQUEST_ERRORS.BODY_INCORRECT_TYPE + `${field}. Expected: ${expected}, but exist: ${type}`
        this.setError({
            message,
            code: 400
        })
    }
}
