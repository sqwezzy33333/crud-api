import type {ServerResponse} from "http";
import {PostPutUser} from "../models/models";
import {storage} from "../storage/storage";

export const postHandler = async (body: string, response: ServerResponse) => {
    const bodyToParse = JSON.parse(body) as PostPutUser;
    response.statusCode = 201;
    await storage.addUser(bodyToParse);
    response.end();
}
