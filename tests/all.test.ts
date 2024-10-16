import supertest from "supertest";
import {initServer} from "../src/init-app";
import {REQUEST_ERRORS} from "../src/constants/constants";
const API = '/api/users';

const testUser = {
    username: 'Test',
    age: 25,
    hobbies: ["dota2", 'sport']
}


describe('All operation', () => {
    const server = supertest(initServer(1000));
    it('Should return array of users', async () => {
        const response = await server.get(API);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('Should create user', async () => {
        const response = await server.post(API).send(JSON.stringify(testUser));

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('Should remove user', async () => {
        const responsePost = await server.post(API).send(JSON.stringify(testUser));
        const uuid = responsePost.body.id;
        const responseRemove = await server.delete(API + '/' + uuid).send();

        expect(responseRemove.statusCode).toBe(200);
    });

    it('Should update user', async () => {
        const user = { ...testUser, username: 'TEST' }
        const responsePost = await server.post(API).send(JSON.stringify(testUser));
        const uuid = responsePost.body.id;
        const responseUpdate = await server.put(API + '/' + uuid).send(user);

        expect(responseUpdate.statusCode).toBe(200);
        expect(responseUpdate.body.username).toBe('TEST');
    });

    it('Should get user', async () => {
        const responsePost = await server.post(API).send(JSON.stringify(testUser));
        const uuid = responsePost.body.id;
        const responseGet = await server.get(API + '/' + uuid).send();

        expect(responseGet.statusCode).toBe(200);
        expect(typeof responseGet.body === 'object').toBeTruthy();
    });
})

describe('Errors', () => {
    const server = supertest(initServer(2000));
    it('Should return error 404', async () => {
        const response = await server.post(API + '/test/users').send(JSON.stringify(testUser));

        expect(response.statusCode).toBe(404);
    });

    it('Should return invalid Uuid', async () => {
        const response = await server.put(API + '/sefsefsef343f43').send(JSON.stringify(testUser));

        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(REQUEST_ERRORS.UUID_INCORRECT);
    });

    it('Should return 400, body is forbidden', async () => {
        const response = await server.get(API).send(JSON.stringify(testUser));

        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(REQUEST_ERRORS.BODY_EXIST);
    });

    it('Should return 400, body dont exist', async () => {
        const response = await server.post(API).send();
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(REQUEST_ERRORS.BODY_DONT_EXIST);
    });

    it('Should return invalid type of body', async () => {
        const invalidBody = {
            name: 'Name',
            age: false,
            hobbies: []
        }
        const response = await server.post(API).send(JSON.stringify(invalidBody));

        expect(response.statusCode).toBe(400);
        expect(response.text.includes(REQUEST_ERRORS.BODY_INCORRECT_FIELD_VALUE)).toBeTruthy();
    });

    it('Should return invalid body field types', async () => {
        const invalidBody = {
            name: 'Name',
            age: false,
            hobbies: []
        }
        const response = await server.post(API).send(JSON.stringify(invalidBody));

        expect(response.statusCode).toBe(400);
        expect(response.text.includes(REQUEST_ERRORS.BODY_INCORRECT_FIELD_VALUE)).toBeTruthy();
    });
})

describe('Full CRUD', () => {
    const server = supertest(initServer(3000));
    it('Should be without errors', async () => {
        const createResponse = await server.post(API).send(JSON.stringify(testUser));
        const id = createResponse.body['id'];
        expect(id).toBeTruthy();
        expect(createResponse.statusCode).toBe(201);

        const getUsersResponse = await server.get(API).send();
        expect(getUsersResponse.statusCode).toBe(200);
        expect(getUsersResponse.body.length).toBeGreaterThan(0);

        const getUserByIdResponse = await server.get(API+ '/' + id).send();
        expect(getUserByIdResponse.statusCode).toBe(200);
        expect(getUserByIdResponse.body.username).toBe(testUser.username);

        const changedName = 'NAME_CHANGED';

        const putResponse = await server.put(API + '/' + id).send({ ...testUser, username: changedName });
        expect(putResponse.statusCode).toBe(200);
        expect(putResponse.body.username).toBe(changedName);

        const deleteResponse = await server.delete(API + '/' + id).send();
        expect(deleteResponse.statusCode).toBe(200);

        const checkUserResponse = await server.get(API + '/' + id).send();
        expect(checkUserResponse.statusCode).toBe(404);
        expect(checkUserResponse.text).toBe(REQUEST_ERRORS.USER_NOT_FOUND);
    });
})
