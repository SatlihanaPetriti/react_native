# react_native

Chat app (WhatsApp clone basically) with a NestJS backend and a React Native frontend. Backend handles auth, users, conversations and messages, frontend is the mobile client. Messaging is real-time through Socket.IO.

## Structure

- `backend/` - NestJS API + WebSocket server, MySQL via TypeORM
- `wp/` - React Native app

## Stack

Backend: NestJS 11, TypeORM, MySQL, Socket.IO, JWT auth, bcrypt for passwords.

Frontend: React Native 0.86, React Navigation, socket.io-client, axios.

## Running it

You need Node 22.11+ and a running MySQL instance.

### Backend

```bash
cd backend
npm install
npm run start:dev
```

DB connection is set in `src/app.module.ts` (host/user/password/database) - change it there for your local MySQL setup. Right now it's hardcoded, would be better in a `.env` at some point.

Runs on port 3000 by default.

### Mobile app

```bash
cd wp
npm install
```

iOS only:
```bash
cd ios && pod install && cd ..
```

Then:
```bash
npm start
```

and in another terminal:
```bash
npm run android
# or
npm run ios
```

If you're testing on a real device or emulator, remember to point the frontend at your machine's actual IP instead of localhost, otherwise the socket connection won't work.

## Tests

```bash
# backend
cd backend && npm run test

# frontend
cd wp && npm run test
```

## Notes

Database is named `whatsapp`, gets created automatically since `synchronize: true` is on in TypeORM - that's convenient for dev but shouldn't be used once this goes anywhere near production.

No license set yet.