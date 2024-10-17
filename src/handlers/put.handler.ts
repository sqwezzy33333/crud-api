import {PostPutUser} from "../models/models";
import type {ServerResponse} from "http";
import {getUuid} from "../utils/utils";
import {storage} from "../storage/storage";

export const putHandler = (body: string, response: ServerResponse, url: string) => {
    const bodyToParse = JSON.parse(body) as PostPutUser;
    const uuid = getUuid(url) as string;
    response.statusCode = 200;
    storage.updateUser(uuid, bodyToParse);
    response.end();
}
