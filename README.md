# Leaderboard Dapp

This project is a decentralized application (dApp) that tracks user activity on a lending protocol and rewards users with points based on their borrowing and supplying activity. The dApp uses a MongoDB database to store user data and utilizes the `chedda-sdk` for interacting with the lending protocol.

## Project Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/chedda-tech/leaderboard.git
   ```

2. **Install dependencies:**

   ```bash
   cd leaderboard
   npm install
   ```

3. **Configure environment variables:** Create a `.env` file in the root directory based on the `.env.sample` file, providing your MongoDB URI and Alchemy API key. Ensure your MongoDB instance is running.

   ```
   MONGO_URI=mongodb://localhost:27017/leaderboard
   ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## Project Structure

- **`src/models/leaderboardModel.ts`:** Defines the Mongoose schema for the leaderboard data.
- **`src/services/leaderboardService.ts`:** Contains the logic for updating and managing the leaderboard. This includes functions to generate unique referral codes, update user points based on borrowing and supplying, and calculate hourly points based on a configurable rate.
- **`src/services/poolEventsService.ts`:** Listens for events from the lending pool (using `chedda-sdk`) such as borrowing, repaying, and collateral changes. It updates the leaderboard based on these events. It uses a `PriceService` to convert asset amounts to USD values for point calculations.
- **`src/utils/constants.ts`:** Contains constants used throughout the application, such as the lending pool address. (This file is assumed to exist based on the provided context).
- **`src/utils/tokens.ts`:** Contains information about supported tokens. (This file is assumed to exist based on the provided context).
- **`src/utils/types.ts`:** Defines TypeScript types used in the project. (This file is assumed to exist based on the provided context).
- **`rest.http`:** Example HTTP requests for testing the API endpoints.
- **`.env`:** Environment variables (replace with your actual credentials).
- **`.env.sample`:** Sample environment variables file.

## API Endpoints

### Leaderboard

- `GET /api/leaderboard` - Retrieve leaderboard data
- `GET /` - Health check endpoint

## Security Features

- Rate limiting middleware (50 requests per 15 minutes)
- POST requests are blocked by default

## Running the Application

### Development

```bash
    npm run dev
```

### Production

```bash
    npm run build
    npm start
```

## Technologies Used

- Node.js
- TypeScript
- Express.js
- Mongoose
- ethers.js
- chedda-sdk

```

```
