# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program.

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src` on port `5173`.
- **Logic tier**: Express and TypeScript routes and services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths, which Vite proxies to `http://localhost:8000`.

## Capabilities

- **Activity tracking**: list and create activities with user, team, type, minutes, points, and occurrence time.
- **Teams**: list and create teams with a name, mascot, and member list.
- **Leaderboard**: rank teams by total activity points.
- **Workout suggestions**: recommend workouts from each user's goal and recent activity.

## Implementation decisions

- Presentation tier decision: React 19 with a shared typed `getJson` client and Bootstrap cards.
- Logic tier decision: Express routes delegate to small Mongoose-backed service functions with deliberate 4xx validation.
- Data tier decision: required Mongoose fields, idempotent seed upserts, and references between users, teams, and activities.
- Activity tracking approach: validate IDs and references, compute points from minutes, and return the created record.
- Team management approach: require name and mascot, accept a validated member array, and return populated member IDs.
- Leaderboard approach: aggregate activity points by team, sort descending, and assign one-based ranks.
- Workout suggestions approach: match the user's fitness goal to a workout focus and explain the match.

## Test plan

- Data-tier command: `npm run test:data --prefix octofit-tracker/backend`
- API command: `npm run test:api --prefix octofit-tracker/backend`
- Frontend command: `npm test --prefix octofit-tracker/frontend`
- Backend build command: `npm run build --prefix octofit-tracker/backend`
- Frontend build command: `npm run build --prefix octofit-tracker/frontend`
