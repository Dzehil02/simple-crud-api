export type BuildMode = 'production' | 'development';

export type contentType = 'text/plain' | 'application/json';

export interface BuildEnv {
    mode: BuildMode;
}

export interface User {
    id?: string;
    username: string;
    age: number;
    hobbies: string[];
}
