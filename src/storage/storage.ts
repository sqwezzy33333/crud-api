import {PostPutUser} from "../models/models";
import {v4 as uuidv4} from 'uuid';

class UserStorage {
    private readonly map: Map<string, PostPutUser> = new Map();

    isUser(userId: string): boolean {
        return !!this.map.get(userId);
    }

    get uuids(): string[] {
        return Object.keys(this.map);
    }

    addUser(body: PostPutUser) {
        const id = this.generateUuid();
        this.map.set(id, body);
    }

    deleteUser(userId: string) {
        this.map.delete(userId);
    }

    updateUser(userId: string, body: PostPutUser) {
        this.map.set(userId, body);
    }

    generateUuid(): string {
        const newUuid = uuidv4();
        if (this.uuids.includes(newUuid)) {
            return this.generateUuid();
        }
        return newUuid;
    }
}

export const storage = new UserStorage();

