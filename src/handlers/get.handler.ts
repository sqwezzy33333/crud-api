import type {ServerResponse} from "http";
import {getUuid} from "../utils/utils";
import {GetUser} from "../models/models";
import {storage} from "../storage/storage";

export const getHandler = (response: ServerResponse, url: string) => {
    const uuid = getUuid(url);
    let responseBody: null | GetUser | GetUser[] = null;
    if (uuid) {
        responseBody = storage.getUserByUuid(uuid);
    } else {
        responseBody = storage.getUsers();
    }
    response.end(JSON.stringify(responseBody));
}
