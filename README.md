# User Directory

A small full-stack user directory with a React + TypeScript frontend and an ASP.NET Core 8 Web API. The API uses EF Core with SQLite; frontend and backend responsibilities are kept separate in `frontend/` and `Backend/`.

## Run locally

Requirements: Node.js 20+ and .NET 8 SDK.

Start the API from this directory:

```powershell
dotnet run --project Backend/UserInformation.Api
```

The API listens at `http://localhost:8080`; Swagger is available at `/swagger`. The default database is `data/app.db` relative to the API process working directory. Set `ConnectionStrings__Users` to change it.

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Set `VITE_API_BASE_URL` if the API uses a different origin.

## Docker Compose

From this directory, run `docker compose up --build`. The frontend is at `http://localhost:5173`, the API at `http://localhost:8080`, and SQLite persists in the `user-data` volume at `/data/app.db`.

## API

- `GET /api/users` lists users; `GET /api/users/{id}` returns one user.
- `POST /api/users` creates a user; `PUT /api/users/{id}` updates one; `DELETE /api/users/{id}` removes one.
- Request fields: `name` (2-100 characters), `age` (integer 0-120), `city`, `state`, and `pincode` (4-10 characters).
- Collection creation uses `POST /api/users` (rather than the nonstandard `POST /api/users/{id}`); successful creation returns `201 Created`, invalid requests return `400`, missing users return `404`, and update/delete return `204`.
- List and detail reads are public. In local development, writes are also public unless both API authentication settings below are configured.

## Optional Microsoft Entra ID (OIDC)

Register a single-page application and a protected API in Microsoft Entra ID. Configure the SPA redirect URI as `http://localhost:5173` and expose an API scope. Set `VITE_ENTRA_CLIENT_ID`, `VITE_ENTRA_TENANT_ID`, and `VITE_ENTRA_API_SCOPE` for the frontend (the last value is typically `api://<api-application-id>/access_as_user`). Set `Authentication__Authority` to `https://login.microsoftonline.com/<tenant-id>/v2.0` and `Authentication__Audience` to the API's audience in the API environment. With both API settings present, JWT bearer tokens are validated and all routes require authentication except the two public GET endpoints. The Add page prompts for Microsoft sign-in and sends the access token for writes. Keep secrets and production origins outside source control.

## Tests

```powershell
cd frontend
npm test
npm run build
cd ..
dotnet test Backend/UserInformation.Api.Tests
```# userInformation
User Directory
