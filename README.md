# VectorShift Frontend Technical Assessment

This submission implements all four requested parts of the assessment using React (frontend) and FastAPI (backend).

## Quick Start

1. Start backend:
   - `cd backend`
   - `python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000`
2. Start frontend:
   - `cd frontend`
   - `npm install`
   - `npm start`
3. Open `http://127.0.0.1:3000`

Frontend submits to `http://127.0.0.1:8000` by default. To change backend URL, set `REACT_APP_API_URL` before starting frontend.

## Live Deployment

- Frontend: `https://frontend-beryl-omega-21.vercel.app`
- Backend: `https://backend-omega-three-93.vercel.app`

Backend parse endpoint:
- `POST https://backend-omega-three-93.vercel.app/pipelines/parse`

## What Was Implemented

### Part 1: Node Abstraction + 5 New Nodes

- Added reusable node framework with shared handle rendering and form fields.
- Existing nodes migrated to the shared abstraction.
- Added 5 new nodes: `Filter`, `Math`, `Merge`, `API`, `Delay`.

Key files:
- `frontend/src/nodes/baseNode.js`
- `frontend/src/nodes/nodes.css`
- `frontend/src/nodes/*.js`

### Part 2: Styling

- Implemented unified visual system with shared colors, typography, spacing, and shadows.
- Styled toolbar, draggable node buttons, canvas container, node cards, handles, and submit button.
- Added responsive refinements for mobile widths and fixed handle-label overlap by moving labels outside node bodies.

Key files:
- `frontend/src/index.css`
- `frontend/src/nodes/nodes.css`

### Part 3: Text Node Logic

- Text node dynamically adjusts dimensions based on content length and line count.
- Parses `{{variable}}` tokens using JavaScript-valid variable naming rules.
- Creates dynamic target handles on the left side for each unique variable.

Key file:
- `frontend/src/nodes/textNode.js`

### Part 4: Backend Integration

- Frontend submit button sends `{ nodes, edges }` to backend parse endpoint.
- Backend returns `{ num_nodes, num_edges, is_dag }`.
- Frontend displays user-friendly alert with returned values.
- Backend uses Kahn's algorithm to determine if the graph is a DAG.

Key files:
- `frontend/src/submit.js`
- `backend/main.py`

## Validation

- Frontend production build compiles successfully (`npm run build`).
- Backend parse endpoint verified for both DAG and cyclic cases.

## Deploy (Extra Credit)

You can host both frontend and backend for demo/review.

### Option A: One-Click on Render (both services)

1. Push this repo to GitHub.
2. In Render, create a new Blueprint and select this repo.
3. Render will read [`render.yaml`](./render.yaml) and create:
   - `vectorshift-backend` (FastAPI)
   - `vectorshift-frontend` (Static React build)
4. After first deploy:
   - Set frontend env var `REACT_APP_API_URL` to your backend URL
     (example: `https://vectorshift-backend.onrender.com`)
   - Set backend env var `CORS_ORIGINS` to your frontend URL
     (example: `https://vectorshift-frontend.onrender.com`)
5. Redeploy both services.

### Option B: Vercel (frontend) + Render (backend)

1. Deploy backend on Render:
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
2. Deploy frontend on Vercel:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `build`
   - Environment variable: `REACT_APP_API_URL=https://<your-backend-domain>`
3. In Render backend service, set:
   - `CORS_ORIGINS=https://<your-vercel-domain>`
4. Redeploy both.

## Manual Test Checklist

Use this checklist before final handoff:
- `MANUAL_TEST_CHECKLIST.md`
