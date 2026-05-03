# Final Screen Recording Script (4-6 min)

## 1) Intro (20 sec)
"Hi, this is my VectorShift technical assessment submission.  
I’ll quickly walk through core functionality, UI fidelity, and the code structure."

## 2) Environment (15 sec)
"This is the deployed app and backend integration is live.  
Save triggers pipeline parsing and DAG validation."

## 3) Functional Demo (2.5-3 min)

### A) Build and connect
- Click `Load Demo` (or drag new nodes).
- Move nodes, reconnect handles, and show edge behavior.
- Show correction flow: reconnect a target input and old edge is auto-replaced.
- Hover an edge and click `×` to remove it quickly.

### B) Text + variable handles
- Open a Text node.
- Enter content with `{{input}}` and `{{customer_id}}`.
- Show dynamic handles appear for parsed variables.

### C) Notes behavior
- Add/select a Note node.
- Click into note: toolbar appears.
- Apply `B`, `I`, `U`, list, and heading (`H1/H2/H3`) styles.
- Change note color.
- Click away: toolbar hides.

### D) Canvas interactions
- Pan mode on/off.
- Zoom in/out (controls + trackpad pinch).
- Minimap and fit-view controls.

### E) Save + backend parsing
- Click `Save`.
- Show response modal: node count, edge count, `Is DAG`.
- Mention structure warnings are shown when graph has disconnected pieces.

### F) Draft persistence
- Make a small change.
- Show `Saving...` then `Draft saved`.
- Refresh page and show restored draft.

## 4) Design Notes (40-50 sec)
"The interface is built to match the provided VectorShift style:
- compact two-row header,
- dotted canvas,
- node card proportions and controls,
- minimap/zoom placement,
- status avatars and draft state behavior.
Interactions are tuned for hover, selection, and editing states."

## 5) Code Walkthrough (60-90 sec)
Open and explain:
- `frontend/src/ui.js`: React Flow wiring, canvas controls, minimap, collapse behavior.
- `frontend/src/store.js`: Zustand state, node/edge CRUD, smart edge replacement.
- `frontend/src/edges/removableEdge.js`: custom edge with inline delete button.
- `frontend/src/nodes/noteNode.js`: note editor, toolbar visibility, formatting actions.
- `frontend/src/submit.js`: robust API submit + DAG summary and warnings.
- `backend/main.py`: `/pipelines/parse`, counts + DAG check.

## 6) Outro (10 sec)
"That’s the final product.  
It includes required functionality, polished UI behavior, and live backend DAG parsing."

## Recording checklist
- Browser zoom at 100%.
- Keep video under 6 minutes.
- Show one successful Save modal.
- Show one reconnection correction and one edge delete.
- Show one note edit with toolbar.
