import {PostPutUser} from "../models/models";
import type {ServerResponse} from "http";
import {getUuid} from "../utils/utils";
import {storage} from "../storage/storage";

export const deleteHandler = (response: ServerResponse, url: string) => {
    const uuid = getUuid(url) as string;
    storage.deleteUser(uuid);
    response.end();
}
