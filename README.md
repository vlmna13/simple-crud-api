## 🚀 Features

- REST API endpoints for `/api/users`
- Full CRUD operations:
  - `GET /api/users` — get all users
  - `GET /api/users/:id` — get user by ID
  - `POST /api/users` — create a new user
  - `PUT /api/users/:id` — update existing user
  - `DELETE /api/users/:id` — delete user
- Built-in **UUID validation**
- Handles **invalid routes (404)** and **server errors (500)**
- Supports **cluster mode** with round-robin load balancing
- **Data synchronization** between all worker processes
- Includes **unit tests** with Jest and Supertest

---

## 🛠️ Tech Stack

- **Node.js 24.x**
- **TypeScript**
- **UUID** — unique user IDs
- **Jest + Supertest** — testing
- **Cluster API** — multi-process scaling

---

## 📦 Setup & Run

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run in development mode

```bash
npm run start:dev
```

### 3️⃣ Run in production mode

```bash
npm run start:prod
```

### 4️⃣ Run in multi-process (cluster) mode

```bash
npm run start:multi
```

---

## ⚙️ Environment Variables

All configuration values are stored in the `.env` file.  
Example configuration is provided in `.env.example`.

Example:

```
PORT=4000
```

---

## 🧪 Testing

Run the automated test suite:

```bash
npm test
```

Test scenarios include:

- Get all users (expect empty array initially)
- Create a new user
- Get user by ID
- Update user by ID
- Delete user by ID
- Verify deleted user no longer exists

---

## 🌐 Example Requests (cURL)

### ➕ Create user

```bash
curl -X POST http://localhost:4000/api/users   -H "Content-Type: application/json"   -d '{"username": "Alice", "age": 25, "hobbies": ["reading", "yoga"]}'
```

### 📋 Get all users

```bash
curl http://localhost:4000/api/users
```

### 🔍 Get user by ID

```bash
curl http://localhost:4000/api/users/<userId>
```

### ✏️ Update user

```bash
curl -X PUT http://localhost:4000/api/users/<userId>   -H "Content-Type: application/json"   -d '{"username": "Alice Updated", "age": 26, "hobbies": ["music"]}'
```

### ❌ Delete user

```bash
curl -X DELETE http://localhost:4000/api/users/<userId>
```

---

## ⚖️ Cluster Mode

When running with `npm run start:multi`, the application:

- Starts a **load balancer** on port `PORT`
- Launches multiple worker processes (one per CPU core - 1)
- Distributes incoming requests using the **round-robin** algorithm
- Synchronizes user data between all workers in real time

```
Request → Load Balancer (PORT)
        → Worker 1 (PORT+1)
        → Worker 2 (PORT+2)
        → Worker 3 (PORT+3)
```
