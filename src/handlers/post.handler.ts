import type {ServerResponse} from "http";
import {GetUser, PostPutUser} from "../models/models";
import {storage} from "../storage/storage";

export const postHandler = async (body: string, response: ServerResponse) => {
    const bodyToParse = JSON.parse(body) as PostPutUser;
    response.statusCode = 201;
    storage.addUser(bodyToParse).then((createdUser: GetUser) => response.end(JSON.stringify(createdUser)));
}
