# Backend API Documentation

This document provides detailed documentation for the backend API of the Uma Musume Pedia application.

## Authentication

All authentication routes are under the `/api/auth` prefix.

### `POST /api/auth/register`

Registers a new user.

**Request Body:**

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Responses:**

*   `201 Created`: User registered successfully.
*   `400 Bad Request`: Username or password not provided.
*   `409 Conflict`: User already exists.
*   `500 Internal Server Error`: Server error.

### `POST /api/auth/login`

Logs in a user and returns a JWT.

**Request Body:**

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Responses:**

*   `200 OK`: Login successful. Returns a JWT.
    ```json
    {
      "token": "your_jwt"
    }
    ```
*   `400 Bad Request`: Username or password not provided.
*   `401 Unauthorized`: Invalid credentials.
*   `500 Internal Server Error`: Server error.

---

## Uma Pedia

These routes are for managing the "Uma Musume" characters.

### `GET /api/uma_musumes`

Returns a list of all "Uma Musume" characters. This route is public.

**Responses:**

*   `200 OK`: Returns an array of "Uma Musume" objects.
*   `500 Internal Server Error`: Server error.

### `GET /api/uma_musumes/:id`

Returns a single "Uma Musume" character by ID. This route is public.

**Parameters:**

*   `id` (URL parameter): The ID of the "Uma Musume" character.

**Responses:**

*   `200 OK`: Returns the "Uma Musume" object.
*   `404 Not Found`: "Uma Musume" not found.
*   `500 Internal Server Error`: Server error.

### `POST /api/uma_musumes`

Creates a new "Uma Musume" character. This is a protected route and requires authentication.

**Headers:**

*   `Authorization`: `Bearer <your_jwt>`

**Request Body (multipart/form-data):**

*   `name` (string, required): The name of the character.
*   `description` (string): A description of the character.
*   `rarity` (string): The rarity of the character.
*   `speed` (integer): The speed stat.
*   `stamina` (integer): The stamina stat.
*   `power` (integer): The power stat.
*   `guts` (integer): The guts stat.
*   `intelligence` (integer): The intelligence stat.
*   `image` (file): An image file of the character.

**Responses:**

*   `200 OK`: Returns the newly created "Uma Musume" object.
*   `401 Unauthorized`: Invalid or missing token.
*   `500 Internal Server Error`: Server error.

### `PUT /api/uma_musumes/:id`

Updates an existing "Uma Musume" character. This is a protected route and requires authentication.

**Headers:**

*   `Authorization`: `Bearer <your_jwt>`

**Parameters:**

*   `id` (URL parameter): The ID of the "Uma Musume" character to update.

**Request Body (multipart/form-data):**

*   Same as `POST /api/uma_musumes`.

**Responses:**

*   `200 OK`: Returns the updated "Uma Musume" object.
*   `401 Unauthorized`: Invalid or missing token.
*   `404 Not Found`: "Uma Musume" not found.
*   `500 Internal Server Error`: Server error.

### `DELETE /api/uma_musumes/:id`

Deletes an "Uma Musume" character. This is a protected route and requires authentication.

**Headers:**

*   `Authorization`: `Bearer <your_jwt>`

**Parameters:**

*   `id` (URL parameter): The ID of the "Uma Musume" character to delete.

**Responses:**

*   `200 OK`: Returns a confirmation message.
    ```json
    {
      "msg": "Uma Musume deleted"
    }
    ```
*   `401 Unauthorized`: Invalid or missing token.
*   `404 Not Found`: "Uma Musume" not found.
*   `500 Internal Server Error`: Server error.

---

## Health Check

### `GET /api/health`

Checks the health of the server and database connection.

**Responses:**

*   `200 OK`: Server is healthy.
    ```json
    {
      "status": "ok"
    }
    ```
*   `500 Internal Server Error`: Server is unhealthy.
