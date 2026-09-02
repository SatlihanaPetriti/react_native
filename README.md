# react_native

Chat app (WhatsApp clone basically) with a NestJS backend and a React Native frontend. Backend handles auth, users, conversations and messages, frontend is the mobile client. Messaging is real-time through Socket.IO.

## Structure

- `backend/` - NestJS API + WebSocket server, MySQL via TypeORM
- `wp/` - React Native app

## Stack

Backend: NestJS 11, TypeORM, MySQL, Socket.IO, JWT auth, bcrypt for passwords.

Frontend: React Native 0.86, React Navigation, socket.io-client, axios.
