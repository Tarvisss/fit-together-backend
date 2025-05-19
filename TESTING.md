



# Fit+Together: Testing Setup

To run tests after cloning the repo:

1. **Install Node.js & NPM**  
   → [https://nodejs.org](https://nodejs.org)

2. **Create a Local Test Database** (e.g. PostgreSQL)  
   ```bash
   createdb fit_together_test
   ```

3. **Add a `.env.test` File** in the root with:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/fit_together_test"
   NODE_ENV="test"
   SECRET_KEY="SecretSecret"
   PORT=3000
   ```

4. **Install Project Dependencies**  
   ```bash
   npm install
   ```

5. **Install Dev Dependencies** (if not already installed)  
   ```bash
   npm install --save-dev jest supertest dotenv-cli cross-env
   ```

6. **Run Tests**  
   ```bash
   npm test
   ```

> ✅ Make sure this test script exists in `package.json`:
```json
"scripts": {
  "test": "dotenv -e .env.test -- cross-env NODE_ENV=test jest"
}
```