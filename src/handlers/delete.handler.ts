import type {ServerResponse} from "http";
import {getUuid} from "../utils/utils";
import {storage} from "../storage/storage";

export const deleteHandler = async (response: ServerResponse, url: string) => {
    response.statusCode = 200;
    const uuid = getUuid(url) as string;
    storage.deleteUser(uuid).then(() => response.end());
}
