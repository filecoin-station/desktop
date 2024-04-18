# Frontend file structure

- Status: PROPOSED


## Context

As the app UI becomes more complex, it makes sense to define a convention on how to organize components / routes.


## Decision

We should adopt the following structure:
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
