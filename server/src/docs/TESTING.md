# Testing & Quality Assurance – Life Planner App

This document provides guidelines for testing and ensuring the quality of the Life Planner App backend.
It covers test planning, writing test cases, running tests, and maintaining a bug-free release cycle.

---

## 1️⃣ Purpose

* Ensure the backend modules (Auth, Timetable, Goals, Habits, Reminders, Database) work as intended.
* Detect and fix bugs early through automated and manual testing.
* Maintain a consistent, stable, and high-quality codebase.

---

## 2️⃣ Tools & Libraries

Install essential testing libraries:

```bash
npm install --save-dev jest supertest nodemon
```

Optional tools:

* [Postman](https://www.postman.com/) – for API testing.
* [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server) – for testing with an in-memory database.
* [ESLint](https://eslint.org/) – for static code analysis.

---

## 3️⃣ Test Strategy

### Types of Tests

| Test Type              | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| **Unit Tests**         | Validate individual functions, controllers, models.  |
| **Integration Tests**  | Check how modules interact (e.g., Auth + DB).        |
| **API/Endpoint Tests** | Validate REST endpoints return correct responses.    |
| **Regression Tests**   | Ensure new changes don’t break existing features.    |
| **Smoke Tests**        | Quickly verify core functionality after deployments. |

### Test Environments

* **Development**: Use a dedicated test database.
* **Continuous Integration (CI)**: Automated testing pipeline (GitHub Actions, GitLab CI, etc.).

> Keep testing data separate from production data.

---

## 4️⃣ Project Structure for Tests

Inside the src folder in server, create a `tests` directory:

```
src/
│
├── tests/
│   ├── auth.test.js
│   ├── timetable.test.js
│   ├── goals.test.js
│   ├── habits.test.js
│   ├── reminders.test.js
│   └── db.test.js
```

* Each module has its own test file.
* Group related tests logically.

---

## 5️⃣ Writing Tests

Example: Unit test for Auth controller (`auth.test.js`):

```js
import request from 'supertest';
import app from '../server.js';

describe('Auth Endpoints', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: '123456' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
```

> Use `jest` for assertions and `supertest` for HTTP request simulation.

---

## 6️⃣ Running Tests

Add script to `package.json`:

```json
"scripts": {
  "test": "jest --watchAll",
  "test:ci": "jest --runInBand"
}
```

Run tests:

```bash
npm test
```

Run tests in CI (no watch mode):

```bash
npm run test:ci
```

---

## 7️⃣ Bug Tracking & Reporting

* Use GitHub Issues / Jira / Trello for tracking bugs.
* Each bug report should include:

    * Title & description.
    * Steps to reproduce.
    * Expected vs actual results.
    * Screenshots/logs (if applicable).

---

## 8️⃣ Quality Assurance Best Practices

* Enforce code style with **ESLint & Prettier**.
* Peer-review all pull requests before merging.
* Keep test coverage high (>80%).
* Automate linting and testing in CI pipelines.
* Use feature branches for changes (never commit to `main` directly).

---

## 9️⃣ Release Checklist

* ✅ All tests pass locally and in CI.
* ✅ No linting errors or warnings.
* ✅ Code reviewed and approved.
* ✅ Update relevant documentation (README, module guides).
* ✅ Tag release in version control.

---

## 🔟 Continuous Improvement

* Regularly review flaky tests.
* Update test cases as features evolve.
* Conduct post-mortems for major bugs and improve processes.

---

### Authors

Testing & Quality Assurance maintained by **QA Team**.