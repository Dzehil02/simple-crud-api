import request from 'supertest';
import {server} from '..';
import {users} from '../store/store';

describe('Testing CRUD operations of simple-crud-api', () => {
    afterAll((done) => {
        server.close(() => {
            console.log('Server closed');
            done();
        });
    });

    it('GET /api/users should return status 200 and users data with two users', async () => {
        const response = await request(server).get('/api/users');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(users);
    });

    it('POST /api/users should return status 201. Users data with three users', async () => {
        expect(users.length).toBe(2);
        const response = await request(server)
            .post('/api/users')
            .send({username: 'Leo', age: 49, hobbies: ['cinema', 'hollywood']});
        expect(response.statusCode).toBe(201);
        expect(response.body.age).toBe(49);
        expect(response.body.username).toBe('Leo');
        expect(users.length).toBe(3);
    });

    it('GET /api/users/:id should return user and status 200', async () => {
        const id = users[2].id;
        const response = await request(server).get(`/api/users/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(users[2]);
    });

    it('PUT /api/users/:id should update user data and return status 200', async () => {
        expect(users.length).toBe(3);
        const id = users[2].id;
        const response = await request(server).put(`/api/users/${id}`).send({username: 'Clint', age: 93});
        expect(response.statusCode).toBe(200);
        expect(response.body.age).toBe(93);
        expect(response.body.username).toBe('Clint');
        expect(users.length).toBe(3);
    });

    it('DELETE /api/users/:id should remove user and return status 204', async () => {
        expect(users.length).toBe(3);
        const id = users[2].id;
        const response = await request(server).delete(`/api/users/${id}`);
        expect(response.statusCode).toBe(204);
        expect(users.length).toBe(2);
    });
});

describe('Testing CRUD operations with non-existent data', () => {
    const id = 'e42e8ae0-c931-11ee-8632-5b37290f5804';
    const notFoundMessage = `User with id ${id} not found`;

    afterAll((done) => {
        server.close(() => {
            console.log('Server closed');
            done();
        });
    });

    it('Should return status 404 and message with correct urls', async () => {
        const response = await request(server).get('/api/posts');
        expect(response.statusCode).toBe(404);
        expect(response.headers['content-type']).toBe('text/plain');
        expect(response.text).toBeDefined;
        expect(response.text).toBe('Not found. Available endpoints are: /, /api/users, /api/users/:id');
    });

    it('Should return status 404 and message User with id not found', async () => {
        const response = await request(server).get(`/api/users/${id}`);
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe(notFoundMessage);
    });

    it('PUT method Should return status 404 and message User with id not found', async () => {
        const response = await request(server).put(`/api/users/${id}`).send({username: 'Clint', age: 93});
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe(notFoundMessage);
    });

    it('DELETE method Should return status 404 and message User with id not found', async () => {
        const response = await request(server).delete(`/api/users/${id}`);
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe(notFoundMessage);
    });
});

describe('Testing CRUD operations with bad request and invalid data', () => {
    const wrongIdFormat = 'not-uuid-format';
    const invalidIdFormat = 'User ID is invalid (not uuid)';
    const wrongContentTypeMessage = 'Bad request. Content-Type must be application/json';
    const wrongUserData = 'Bad request. Invalid data. User must have required fields: username, age, hobbies';

    afterAll((done) => {
        server.close(() => {
            console.log('Server closed');
            done();
        });
    });

    it('Should return status 400 and invalid Id format message', async () => {
        const response = await request(server).get(`/api/users/${wrongIdFormat}`);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(invalidIdFormat);
    });

    it('PUT method should return status 400 and invalid Id format message', async () => {
        const response = await request(server).put(`/api/users/${wrongIdFormat}`).send({username: 'Clint', age: 93});
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(invalidIdFormat);
    });

    it('DELETE method should return status 400 and invalid Id format message', async () => {
        const response = await request(server).delete(`/api/users/${wrongIdFormat}`);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(invalidIdFormat);
    });

    it('POST method should return status 400 and wrong Content-Type message', async () => {
        const response = await request(server).post('/api/users').send("firstname: 'Leo', age: 49, hobbies: ['cinema', 'hollywood']");
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(wrongContentTypeMessage);
    });

    it('POST method should return status 400 and wrong User data message', async () => {
        const response = await request(server)
            .post('/api/users')
            .send({firstname: 'Leo', age: 49, hobbies: ['cinema', 'hollywood']});
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(wrongUserData);
    });
});
