# Submission Package

## Commit message (recommended)
`feat: finalize pipeline builder UX, edge management, and robust deploy parsing`

## Commit body (optional)
- match header/subheader/canvas layout and interaction polish
- improve note editing UX (focus/toolbar/typing behavior)
- add smart edge replacement on reconnect (single target-handle source of truth)
- add removable edge UI (`×`) with hover/select behavior
- harden submit API flow with hosted fallback endpoints
- add Vercel rewrite for frontend `/api` proxy to backend
- stabilize draft save status and restore behavior

## PR title (recommended)
`Finalize VectorShift assessment: UI parity + stable graph interactions + deploy-safe parsing`

## PR description (copy/paste)
## Summary
This PR finalizes the VectorShift frontend technical assessment with a focus on:
- UI fidelity and interaction polish
- graph-editing correctness
- deployment reliability for backend parsing

## What changed
- Refined top header/subheader/canvas styling and spacing to match reference behavior.
- Improved note-node editing behavior and toolbar focus interactions.
- Added smart edge reconnect behavior:
  - reconnecting to the same input handle auto-replaces the old edge.
- Added custom removable edge with inline `×` control.
- Hardened pipeline submit flow with endpoint fallback logic.
- Added frontend Vercel rewrite for `/api/*` to backend service.

## Key files
- `frontend/src/ui.js`
- `frontend/src/store.js`
- `frontend/src/submit.js`
- `frontend/src/index.css`
- `frontend/src/nodes/noteNode.js`
- `frontend/src/edges/removableEdge.js`
- `frontend/vercel.json`
- `backend/main.py`

## Verification
- Frontend build succeeds.
- Backend parse route returns valid DAG summary.
- Deployed flow succeeds on Save with modal response:
  - nodes count
  - edges count
  - DAG validity
- Edge correction UX verified (replace + inline delete).

## Deployed links
- Frontend: `https://frontend-beryl-omega-21.vercel.app`
- Backend: `https://backend-omega-three-93.vercel.app`

## Quick final QA checklist
- [ ] Drag/drop nodes works
- [ ] Reconnect-to-same-input replaces prior edge
- [ ] Hover edge shows `×` and click removes edge
- [ ] Note toolbar appears only on focus and supports formatting
- [ ] Save returns parse modal without fetch errors
- [ ] Draft saved state updates and restores after refresh
