# Campaign App Project

This is the base repository for the Campaign App project, which consists of a frontend and a backend.

## Project Structure

- [`CampaignAppBackend`](./CampaignAppBackend/README.md) — Spring Boot-based backend
- [`CampaignAppFrontend`](./CampaignAppFrontend/README.md) — Frontend in React

## Authentication Notice

⚠️ **Auth System**

For testing and fast development purposes, there were created a **very simple custom authentication system**.

- **No Spring Security used**
- **Passwords are not hashed**
- **No refresh tokens**
- **After successful login there's generated 1h AuthToken, after that time we need to log in again**
- **AuthToken is saved in localStorage**

This is purely for testing basic features and flows.

## Default Test User and Campaign

When the backend application starts, it automatically creates:

- A user:
  - **Email:** email@gmail.com
  - **Password:** password

- A sample test campaign is also created automatically.