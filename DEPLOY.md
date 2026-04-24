## Deploy Plan

### Backend on Render

1. Create a new Web Service from this repo.
2. Render will detect `render.yaml`.
3. After the backend is live, copy the backend URL.

### Frontend on Vercel

1. Import the repo in Vercel.
2. Set the root directory to `frondend`.
3. Add an environment variable:
   `VITE_API_BASE_URL=https://your-render-backend-url.onrender.com`
4. Deploy.

### Optional backend env vars

- `FRONTEND_URL=https://your-vercel-app-url.vercel.app`
- `SECRET_KEY=...`
