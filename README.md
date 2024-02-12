# Simple CRUD api

### Start checking:

1. You need clone this repo
2. Go to folder **_simple-crud-api_**
3. To install all dependencies use `npm install`
4. You can start the app:

    - in development mode using `npm run start:dev`
    - in production mode using `npm run start:prod`

5. You can run tests using `npm test`

App uses _user_id_ of uuid format. For example: `4389c860-c9b9-11ee-bb35-999792e3ab4a`

### Use endpoints:

`GET` with url `api/users` to get all users. You will get answer with two users like:

```
[
    {
        "id": "4389c860-c9b9-11ee-bb35-999792e3ab4a",
        "username": "Tom",
        "age": 72,
        "hobbies": ["hiking", "fishing"]
    },
    {
        "id": "not-a-uuid",
        "username": "Bob",
        "age": 27,
        "hobbies": ["baseball", "basketball"]
    }
]
```

`GET` with url `api/users/:id` to get one user data like:

```
    {
        "id": "4389c860-c9b9-11ee-bb35-999792e3ab4a",
        "username": "Tom",
        "age": 72,
        "hobbies": ["hiking", "fishing"]
    }
```

`POST` with url `api/users` to add user. You need to send body like:
```
    {
        "username": "Alex",
        "age": 18,
        "hobbies": ["books", "sports"]
    }
```

`PUT` with url `api/users/:id` to update user. You need to send body with fields which you want to update. Example:
```
    {
        "username": "Kevin",
    }
```

`DELETE` with url `api/users/:id` to remove user.
