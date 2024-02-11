import { User } from "../types/types";

export function isUser(obj: any): obj is User {
    return (
        typeof obj.id === 'string' &&
        typeof obj.username === 'string' &&
        typeof obj.age === 'number' &&
        Array.isArray(obj.hobbies)
    );
}