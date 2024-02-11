export type BuildMode = 'production' | 'development';

export interface BuildEnv {
    mode: BuildMode;
}

export interface User {
    id?: string;
    username: string;
    age: number;
    hobbies: string[];
}
