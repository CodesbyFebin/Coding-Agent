# local-frontend

An unwired reference client for the new `backend/` API (the workspace-based
agent-runtime subsystem — see `backend/README.md`).

This is a plain React app copied **untouched** from the original source
material, kept only as a reference for the shape of the API the backend
exposes (auth, workspaces, missions, evidence, approvals, MCP, schedules,
events). It is **not** integrated into either of this repo's shipping
frontends (`frontend/` — Vite — or `web/` — Next.js) and is not part of any
build. There is no `package.json`, `index.html`, or bundler config here; it
is source files only.

Known issues, left as-is because this folder is reference material, not a
working app:

- `src/App.jsx` has a syntax error (`window.location.href '/logout'` —
  missing `=`).
- `src/components/MissionDetail.jsx` has a syntax error (an invalid
  template-literal-in-JSX expression around `{s: ...}`).
- `src/store.js` and `src/store/store.js` are duplicate, drifted copies of
  the same store; `App.jsx` and `MissionDetail.jsx` import the top-level one,
  `MissionList.jsx` imports the nested one.
- `src/main.js` imports `{ api }` from `src/api/index.js`, but that module
  only exports named exports (`auth`, `workspaces`, `missions`, ...), not a
  combined `api` object — `App.jsx`'s `import { api } from './api/index.js'`
  and the components' `import { api } from '../api/index.js'` would not
  resolve as written either.

If this ever needs to become a real client, it would need: a build tool
(Vite), a fix for the issues above, and a decision on which of the two
`store.js` files to keep.
