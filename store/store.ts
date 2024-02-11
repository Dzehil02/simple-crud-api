import { createPassword } from '../src/helpers';
import {User} from '../types/types';


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
