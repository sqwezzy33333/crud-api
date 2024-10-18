import type {ServerResponse} from "http";

export type Method = 'GET' | 'POST' | 'DELETE' | 'PUT';

export interface ValidationRequestError {
    message: string;
    code: number;
}

export interface PostPutUser {
    username: string;
    age: number;
    hobbies: string[];
}

export interface GetUser extends PostPutUser{
    id: string;
}

export interface ChildClusterMessage {
    type: string;
    error: ValidationRequestError,
}
