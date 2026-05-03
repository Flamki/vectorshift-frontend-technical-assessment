# Manual Test Checklist

## Environment

1. Run backend on `http://127.0.0.1:8000`.
2. Run frontend on `http://127.0.0.1:3000`.
3. Confirm browser loads without runtime errors.

## Part 1: Node Abstraction and New Nodes

1. Confirm toolbar shows 9 node types: `Input`, `LLM`, `Output`, `Text`, `Filter`, `Math`, `Merge`, `API`, `Delay`.
2. Drag each node type onto canvas once.
3. Confirm each node renders with handles and consistent styling.

## Part 2: Styling

1. Confirm toolbar/canvas/submit areas follow one cohesive design.
2. Confirm handle labels are readable and do not overlap node text.
3. Resize browser to mobile width (<640px):
4. Confirm toolbar wraps cleanly and submit button spans full width.

## Part 3: Text Node Logic

1. Drag a `Text` node to canvas.
2. Enter short text and then long multi-line text.
3. Confirm node grows in width/height as text increases.
4. Enter `Hello {{input}} {{user_name}}`.
5. Confirm two left handles appear for `input` and `user_name`.
6. Remove a variable token and confirm corresponding handle disappears.

## Part 4: Backend Integration

1. Create simple acyclic flow (for example, `Input -> LLM -> Output`).
2. Click `Submit Pipeline`.
3. Confirm alert appears with node count, edge count, and `Is DAG: Yes`.
4. Create cycle (for example, connect `A -> B` and `B -> A`).
5. Click submit again.
6. Confirm alert shows `Is DAG: No`.

## Regression Spot-Checks

1. Dragging and connecting nodes still works after edits.
2. Node form fields remain editable.
3. No text overlap in `LLM` and `Math` nodes at common zoom levels.
