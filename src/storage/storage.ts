import {GetUser, PostPutUser} from "../models/models";
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';

export class UserStorage {
    readonly DATABASE_PATH = './src/storage/database.json';
    storage: GetUser[] = [];

    async isUser(userId: string): Promise<boolean> {
        await this.readDatabase();
        return this.storage.map(e => e.id).includes(userId);
    }

    getUuids(): string[] {
        return this.storage.map(e => e.id);
    }

    async readDatabase() {
        return new Promise<void>((resolve, reject) => {
            let data = ''
            const stream = fs.createReadStream(this.DATABASE_PATH);
            stream.on('data', (chunk) => {
                data += chunk.toString();
            });
            stream.on('end', () => {
                if (data) {
                    this.storage = JSON.parse(data);
                }

                resolve();
            })
        })
    }

    async updateDatabase() {
        return new Promise<void>((resolve, reject) => {
            const toString = JSON.stringify(this.storage);
            fs.writeFile(this.DATABASE_PATH, toString, (err) => {
                if (err) reject(err);
                resolve();
            })
        })
    }

    async addUser(body: PostPutUser) {
        await this.readDatabase();
        const id = this.generateUuid();
        const newUser: GetUser = {id, ...body};
        this.storage.push(newUser);
        return this.updateDatabase();
    }

    async deleteUser(userId: string) {
        await this.readDatabase();
        const findIndex = this.storage.findIndex(e => e.id === userId);
        this.storage.splice(findIndex, 1);
        return this.updateDatabase();
    }

    async updateUser(userId: string, body: PostPutUser) {
        await this.readDatabase();
        const findIndex = this.storage.findIndex(e => e.id === userId);
        this.storage[findIndex] = {...body, id: userId};
        return this.updateDatabase();
    }

    async getUserByUuid(id: string): Promise<GetUser> {
        await this.readDatabase();
        return this.storage.find((e) => e.id === id) as GetUser;
    }

    async getUsers(): Promise<GetUser[]> {
        await this.readDatabase();
        return this.storage;
    }

    generateUuid(): string {
        const newUuid = uuidv4();
        if (this.getUuids().includes(newUuid)) {
            return this.generateUuid();
        }
        return newUuid;
    }
}

export const storage = new UserStorage();

