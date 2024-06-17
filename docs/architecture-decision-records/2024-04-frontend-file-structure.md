# Frontend file structure

- Status: PROPOSED


## Context

As the app UI is becoming more complex, more groupings are necessary in order to keep the amount of components per file / folder sensibly small.


## Decision

We are adopting the following structure:
```
src/
    pages/
        dashboard/
            Dashboard.tsx <- entrypoint			  
            Graph.tsx <- component specific to page
            ...
    components/ <- common UI components
        Button.tsx
        Text.tsx
        ...
```

- Each route should have it's own directory inside `pages`
- Each route directory should have an entrypoint component with the name of the route (ex: `/dashboard` -> `Dashboard.tsx`)
- Alongside the entrypoint component, place any component that is specific to that route.
- In the `components` directory, place common UI components, such as `Text`, `Button`, `Modal`, etc.
