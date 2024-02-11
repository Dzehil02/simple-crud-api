import {User} from '../types/types';
import {v1 as uuidv4} from 'uuid';

export const createPassword = () => uuidv4();

export const users: User[] = [
    {
        id: createPassword(),
        username: 'Tom',
        age: 72,
        hobbies: ['hiking', 'fishing'],
    },
    {
        id: 'not-a-uuid',
        username: 'Bob',
        age: 27,
        hobbies: ['baseball', 'basketball'],
    },
];
