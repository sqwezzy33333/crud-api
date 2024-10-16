import {Method} from "../models/models";

export const METHODS: Record<string, Method> = {
    get: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE',
}

export const DEFAULT_PATH = '/users';

export const REQUEST_ERRORS = {
    NOT_FOUND: "Path don't exist",
    UUID_INCORRECT: "Uuid is incorrect",
    UUID_DONT_EXIST: "Uuid don't exist",
    UUID_EXIST: "Uuid is forbidden",
    BODY_INVALID_JSON: "Body is invalid JSON",
    BODY_NOT_OBJECT: "Body is not object",
    BODY_DONT_EXIST: "Body don't exist",
    BODY_UNEXPECTED_KEY: "Unexpected key: ",
    BODY_EXPECTED_KEY: "Expected key: ",
    BODY_INCORRECT_FIELD_VALUE: "Incorrect field value: ",
    BODY_INCORRECT_TYPE: "Incorrect field type: ",
}
