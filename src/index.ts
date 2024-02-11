import dotenv from 'dotenv';
import http from 'http';
import { controller } from './controller';

dotenv.config();
const PORT = process.env.PORT || 5050;

const server = http.createServer((req, res) => {
    controller(req, res);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
