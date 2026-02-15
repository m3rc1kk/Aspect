# API Тестирование комментариев

## Базовый URL
```
http://localhost:8000/api
```

## Авторизация
Для всех запросов (кроме GET) нужен токен:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 1. Получить все комментарии к посту

**GET** `/comments/post/{post_id}/`

```http
GET http://localhost:8000/api/comments/post/1/
```

**Response 200:**
```json
[
  {
    "id": 1,
    "post": 1,
    "author": {
      "id": 1,
      "username": "john",
      "email": "john@example.com",
      "nickname": "Johnny"
    },
    "parent": null,
    "content": "Отличный пост!",
    "created_at": "2026-02-15T10:30:00Z",
    "updated_at": "2026-02-15T10:30:00Z",
    "replies": [
      {
        "id": 2,
        "post": 1,
        "author": {
          "id": 2,
          "username": "jane",
          "email": "jane@example.com",
          "nickname": "Jane"
        },
        "parent": 1,
        "content": "Согласен!",
        "created_at": "2026-02-15T10:35:00Z",
        "updated_at": "2026-02-15T10:35:00Z",
        "replies_count": 0
      }
    ]
  }
]
```

---

## 2. Получить список комментариев (с фильтром по посту)

**GET** `/comments/?post={post_id}`

```http
GET http://localhost:8000/api/comments/?post=1
```

**Response 200:**
```json
[
  {
    "id": 1,
    "post": 1,
    "author": {
      "id": 1,
      "username": "john",
      "email": "john@example.com",
      "nickname": "Johnny"
    },
    "parent": null,
    "content": "Первый комментарий!",
    "created_at": "2026-02-15T10:30:00Z",
    "updated_at": "2026-02-15T10:30:00Z",
    "replies": []
  }
]
```

---

## 3. Создать комментарий к посту

**POST** `/comments/`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**
```json
{
  "post": 1,
  "content": "Это мой комментарий к посту!"
}
```

**Response 201:**
```json
{
  "id": 5,
  "post": 1,
  "author": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "nickname": "Johnny"
  },
  "parent": null,
  "content": "Это мой комментарий к посту!",
  "created_at": "2026-02-15T12:00:00Z",
  "updated_at": "2026-02-15T12:00:00Z",
  "replies_count": 0
}
```

---

## 4. Создать ответ на комментарий (reply)

**POST** `/comments/`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**
```json
{
  "post": 1,
  "parent": 5,
  "content": "Это мой ответ на комментарий!"
}
```

**Response 201:**
```json
{
  "id": 6,
  "post": 1,
  "author": {
    "id": 2,
    "username": "jane",
    "email": "jane@example.com",
    "nickname": "Jane"
  },
  "parent": 5,
  "content": "Это мой ответ на комментарий!",
  "created_at": "2026-02-15T12:05:00Z",
  "updated_at": "2026-02-15T12:05:00Z",
  "replies_count": 0
}
```

---

## 5. Получить конкретный комментарий

**GET** `/comments/{id}/`

```http
GET http://localhost:8000/api/comments/5/
```

**Response 200:**
```json
{
  "id": 5,
  "post": 1,
  "author": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "nickname": "Johnny"
  },
  "parent": null,
  "content": "Это мой комментарий к посту!",
  "created_at": "2026-02-15T12:00:00Z",
  "updated_at": "2026-02-15T12:00:00Z",
  "replies": [
    {
      "id": 6,
      "post": 1,
      "author": {
        "id": 2,
        "username": "jane",
        "email": "jane@example.com",
        "nickname": "Jane"
      },
      "parent": 5,
      "content": "Это мой ответ на комментарий!",
      "created_at": "2026-02-15T12:05:00Z",
      "updated_at": "2026-02-15T12:05:00Z",
      "replies_count": 0
    }
  ]
}
```

---

## 6. Получить все ответы на комментарий

**GET** `/comments/{id}/replies/`

```http
GET http://localhost:8000/api/comments/5/replies/
```

**Response 200:**
```json
[
  {
    "id": 6,
    "post": 1,
    "author": {
      "id": 2,
      "username": "jane",
      "email": "jane@example.com",
      "nickname": "Jane"
    },
    "parent": 5,
    "content": "Это мой ответ на комментарий!",
    "created_at": "2026-02-15T12:05:00Z",
    "updated_at": "2026-02-15T12:05:00Z",
    "replies_count": 0
  }
]
```

---

## 7. Обновить комментарий (только автор)

**PATCH** `/comments/{id}/`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**
```json
{
  "content": "Обновлённый текст комментария"
}
```

**Response 200:**
```json
{
  "content": "Обновлённый текст комментария"
}
```

---

## 8. Удалить комментарий (только автор)

**DELETE** `/comments/{id}/`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

```http
DELETE http://localhost:8000/api/comments/5/
```

**Response 204:** No Content

---

## Ошибки

### Попытка ответить на reply (запрещено)
**POST** `/comments/`

**Body:**
```json
{
  "post": 1,
  "parent": 6,
  "content": "Ответ на ответ (не сработает)"
}
```

**Response 400:**
```json
{
  "parent": ["Cannot reply to a reply. Only one level of nesting allowed"]
}
```

---

### Parent из другого поста
**POST** `/comments/`

**Body:**
```json
{
  "post": 2,
  "parent": 5,
  "content": "Комментарий"
}
```

**Response 400:**
```json
{
  "parent": ["Parent comment must belong to the same post"]
}
```

---

### Редактирование чужого комментария
**PATCH** `/comments/5/`

**Response 403:**
```json
{
  "detail": "You do not have permission to perform this action."
}
```

---

### Комментарий без авторизации (создание)
**POST** `/comments/`

**Response 401:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Примеры для Postman/Insomnia

### Переменные окружения
```
base_url = http://localhost:8000/api
token = your_jwt_token_here
```

### Быстрые тесты

1. Создать пост (нужен для тестов)
2. Создать комментарий к посту
3. Создать ответ на комментарий
4. Получить все комментарии поста
5. Обновить свой комментарий
6. Удалить комментарий

---

## cURL примеры

### Создать комментарий
```bash
curl -X POST http://localhost:8000/api/comments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "post": 1,
    "content": "Тестовый комментарий"
  }'
```

### Получить комментарии поста
```bash
curl http://localhost:8000/api/comments/post/1/
```

### Создать ответ
```bash
curl -X POST http://localhost:8000/api/comments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "post": 1,
    "parent": 5,
    "content": "Ответ на комментарий"
  }'
```

### Обновить комментарий
```bash
curl -X PATCH http://localhost:8000/api/comments/5/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content": "Обновлённый текст"
  }'
```

### Удалить комментарий
```bash
curl -X DELETE http://localhost:8000/api/comments/5/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```
