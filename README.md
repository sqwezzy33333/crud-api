# Simple-CRUD-Api

---

## Prerequisites

1. Install [Node.js](https://nodejs.org/en/download/)
2. Clone this repository `git clone https://github.com/sqwezzy33333/crud-api`
3. Go to folder `cd crud-api`
4. Change current branch to develop `git checkout develop`
5. Install all dependencies `npm install`
6. Create file in the root of the project with name `.env` and paste `PORT=1000` into it
7. Print into console to run development mode: `npm run start:dev` or production mode: `npm run start:prod`

---

## Description

This API allows managing users with basic CRUD operations.

### Base URL

`http://localhost:1000`

## Endpoints

---

### GET /api/users

**Description**: Fetch a user by ID.

**Response**:

- `200 OK`: Returns an array of all users.

### Example:

```
curl -X GET http://localhost:1000/api/users
```

---

### GET /api/users/{userId}

where `{userId}` is uuidv4

**Description**: Fetch a user by ID.

**Response**:

- `200 OK`: Returns the user.
- `400 Bad Request`: Invalid `userId`.
- `404 Not Found`: User does not exist.

### Example:

```
curl -X GET http://localhost:1000/api/users/{userId}
```

---

### POST /api/users

**Description**: Create a new user.

**Body**:

- `username` (string, required)
- `age` (number, required)
- `hobbies` (array of strings, or empty array, required)

**Response**:

- `201 Created`: Returns the newly created user.
- `400 Bad Request`: Missing or invalid fields.

### Example:

```
curl -X POST http://localhost:1000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "John", "age": 30, "hobbies": ["reading"]}'
```

---

### PUT /api/users/{userId}

**Description**: Update an existing user.

**Body**:

- `username` (string, required)
- `age` (number, required)
- `hobbies` (array of strings, or empty array, required)

**Response**:

- `200 OK`: Returns the updated user.
- `400 Bad Request`: Missing or invalid fields.
- `404 Not Found`: User does not exist.

### Example:

```
curl -X PUT http://localhost:1000/api/users/{userId} \
  -H "Content-Type: application/json" \
  -d '{"username": "JohnUpdated", "age": 31, "hobbies": ["gaming"]}'
```

---

### DELETE /api/users/{userId}

**Description**: Delete a user by ID.

**Response**:

- `204 No Content`: User deleted.
- `400 Bad Request`: Invalid `userId`
- `404 Not Found`: User does not exist.

### Example:

```
curl -X DELETE http://localhost:1000/api/users/{userId}
```

---

## User Object Structure in DB

```
{
  "id": "string (uuid)",
  "username": "string",
  "age": "number",
  "hobbies": ["array of strings"] | []
}
```
