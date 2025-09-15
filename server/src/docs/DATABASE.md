# Database & System Integration – Life Planner App

This guide explains how to set up and maintain the database layer for the Life Planner App.
It covers MongoDB setup, connection management, and integration best practices.

---

## 1️⃣ Purpose

* Design and maintain the MongoDB database for all modules (Auth, Timetable, Goals, Habits, Reminders).
* Ensure smooth integration between backend APIs and the database.
* Monitor, secure, and optimize database usage.

---

## 2️⃣ Tools & Dependencies

Install MongoDB-related packages:

```bash
npm install mongoose
```

Optional (for advanced monitoring/backups):

* [MongoDB Compass](https://www.mongodb.com/try/download/compass)
* [MongoDB Atlas CLI](https://www.mongodb.com/docs/atlas/cli/)

---

## 3️⃣ Database Setup

### a) **MongoDB Atlas (Cloud)**

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **Cluster** (Free tier is fine for MVP).
3. Create a **Database User** with a username & password.
4. Add your IP to **Network Access** (or allow all IPs for testing).
5. Copy your connection string, e.g.:

```
mongodb+srv://<user>:<password>@cluster0.mongodb.net/lifeplanner
```

### b) **Local MongoDB**

1. [Install MongoDB Community Edition](https://www.mongodb.com/try/download/community).
2. Run the server:

   ```bash
   mongod
   ```
3. Connect with Compass or CLI:

   ```bash
   mongo
   ```

---

## 4️⃣ Environment Variables

Add to `.env.example`:

```bash
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/lifeplanner
NODE_ENV=development
PORT=5000
```

> **Note:** Never commit your real `.env` file.

---

## 5️⃣ Connecting to MongoDB

Create `config/db.js`:

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

In `server.js`:

```js
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
connectDB();
```

---

## 6️⃣ Database Design

* **Users** – stores authentication data and profile info.
* **Timetable** – schedules/events.
* **Goals** – goals and milestones.
* **Habits** – daily/weekly habits and streaks.
* **Reminders** – notifications for timetable, goals, and habits.

> Keep models modular in `/models` directory.

---

## 7️⃣ Data Management

* Use `mongoose` schemas for validation.
* Add indexes where frequent queries occur (e.g., `user` field).
* For production, enable backups in Atlas.

---

## 8️⃣ Integration Best Practices

* Keep all DB access inside **models/controllers** (no direct queries in routes).
* Use `async/await` for queries.
* Handle errors with `try/catch` and pass them to Express error middleware.
* Keep connection logic in a single file (`db.js`).
* Close connections properly when running tests.

---

## 9️⃣ Testing Database

* Use a separate **test database**:

  ```
  MONGO_URI_TEST=mongodb://localhost:27017/lifeplanner_test
  ```
* Seed sample data for local development if needed.
* Use tools like \[MongoDB Compass] for visual management.

---

## 🔟 Security

* Never expose credentials in code.
* Restrict database user privileges (read/write only).
* Enable IP whitelisting on Atlas.
* Regularly rotate credentials.

---

## 1️⃣1️⃣ Scaling & Optimization

* Use **Replica Sets** for high availability (Atlas handles this).
* Shard if dataset grows large.
* Optimize queries with indexes (`.explain()` in Mongo shell).

---

## 1️⃣2️⃣ Troubleshooting

| Issue            | Solution                           |
| ---------------- | ---------------------------------- |
| `ECONNREFUSED`   | Check if MongoDB server is running |
| Timeout on Atlas | Ensure your IP is whitelisted      |
| Schema errors    | Verify field types in model        |

---

### Authors

Database & System Integration maintained by **Database Team**.