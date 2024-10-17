import type {ServerResponse} from "http";
import {getUuid} from "../utils/utils";
import {storage} from "../storage/storage";

export const getHandler = async (response: ServerResponse, url: string) => {
    const uuid = getUuid(url);
    response.statusCode = 200;
    if (uuid) {
        storage.getUserByUuid(uuid).then((user) => response.end(JSON.stringify(user)));
    } else {
        storage.getUsers().then((users) => response.end(JSON.stringify(users)));
    }
}
