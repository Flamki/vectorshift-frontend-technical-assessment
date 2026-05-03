# Screen Recording Script (Practice)

Use this as your speaking script for the final submission video.
Target duration: 4 to 6 minutes.

## 1) Intro (20-30 sec)

"Hi, this is my VectorShift frontend technical assessment submission.
I will walk through the final product in three parts:
1. Functionality,
2. Design and styling,
3. A brief code walkthrough."

## 2) Run + Setup (20-30 sec)

"I am running:
- frontend on `http://127.0.0.1:3000`
- backend on `http://127.0.0.1:8000`

The frontend sends pipeline data to the backend parse endpoint on submit."

## 3) Product Walkthrough: Core Functionality (2-3 min)

### 3.1 Build a pipeline

"From the toolbar, I can drag nodes into the canvas.
I can create and move nodes, connect handles, and arrange the flow visually."

Actions to show:
- Drag 3-4 nodes to canvas
- Connect a few edges
- Move nodes around

### 3.2 Text node dynamic behavior

"The Text node dynamically resizes based on content length.
It also parses variables in `{{variable_name}}` format.
For each valid variable, a corresponding input handle is created on the left side."

Actions to show:
- Add Text node
- Type multi-line content so the node grows
- Add `{{input}}` and `{{customer_id}}`
- Point out created variable handles

### 3.3 Notes functionality

"The Note node behaves like a sticky note.
The toolbar appears when focused for editing.
It supports color, bold, italic, underline, lists, and heading levels."

Actions to show:
- Add Note node
- Click into note (toolbar appears)
- Change style and color
- Click away (toolbar hides)

### 3.4 Canvas interactions

"The canvas supports panning and zooming, including touchpad behavior and minimap controls."

Actions to show:
- Pan canvas
- Zoom in and out
- Use mini controls and minimap

### 3.5 Draft save behavior

"Draft state updates while editing and persists in local storage."

Actions to show:
- Make a quick change
- Show saving to saved state
- Refresh page and show state restored

### 3.6 Backend integration (required Part 4)

"On submit, frontend sends `{ nodes, edges }` to `/pipelines/parse`.
Backend returns:
- `num_nodes`
- `num_edges`
- `is_dag`

Then the frontend displays those values in an alert."

Actions to show:
- Click Submit or Save
- Show alert values
- Optionally create a cycle and show `is_dag: false`

## 4) Design Walkthrough (45-60 sec)

"For styling, I implemented a unified visual system:
- consistent spacing, borders, radii, and shadows
- cohesive toolbar, canvas, and node appearance
- polished hover, focus, and active states
- responsive behavior for smaller layouts

I also aligned canvas controls, minimap, and top utility actions for a clean product-level UI."

## 5) Brief Code Walkthrough (60-90 sec)

"High-level code structure:
- Node abstraction is centered around a reusable base node component.
- New nodes are built on top of that abstraction for faster extension.
- Text node logic handles dynamic sizing and variable parsing.
- Zustand store manages nodes, edges, updates, and draft reset.
- Submit flow posts pipeline data to FastAPI and renders backend response.

Backend:
- `/pipelines/parse` computes node count and edge count
- and checks DAG validity using topological processing."

Files to open while speaking:
- `frontend/src/nodes/baseNode.js`
- `frontend/src/nodes/textNode.js`
- `frontend/src/store.js`
- `frontend/src/submit.js`
- `backend/main.py`

## 6) Outro (10-15 sec)

"That is the final implementation.
It covers all required parts: abstraction, styling, text-node logic, and backend integration.
Thank you for your time."

---

## Quick Recording Tips

- Record at 100% browser zoom.
- Keep cursor movements slow and deliberate.
- Narrate what matters and avoid dead air.
- If you make a mistake, pause 2 seconds, then repeat the line.
- Keep total video under 6 minutes.
