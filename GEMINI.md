# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `bun x ultracite fix`
- **Check for issues**: `bun x ultracite check`
- **Diagnose setup**: `bun x ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors
- **Data Fetching**:
  - Use **Axios** (`utils/api.ts`) for all HTTP requests.
  - Use **TanStack React Query** for data fetching hooks (queries/mutations).
  - Use **TanStack React Form** for complex form handling.

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Styling & Responsive Design

- **Styling**:
  - Use **Tailwind CSS** for utility classes.
  - Use Tailwind CSS v4 standardized best practices (e.g., `bg-background` instead of `bg-[var(--background)]`).
  - **Always** use the `cn()` utility function (from `@/utils/utils`) when applying `className` props to ensure consistency and mergeability.
- **Responsive Design**: Utilize Tailwind's responsive utilities (`sm:`, `md:`, `lg:`) for mobile-first design.
- **Mobile Optimization**: Ensure the app is mobile-friendly with touch gestures and responsive layouts.

**Structure**

- `app/`: Next.js app router pages/layouts.
- `features/`: feature modules and UI.
- `core/`: shared domain logic.
- `utils/`: helpers.
- `i18n/`: locale and translation setup.
- `public/`: static assets.
- `proxy.ts`: local proxy/config (if used).

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

# API Architecture & Conventions

This project utilizes a highly modular **Service-Model Architecture** to handle API calls. This cleanly separates data fetching, type definitions, state management, and the UI.

## Directory Structure

### 1. `core/models/` (Data Structures & Typing)
This directory holds the TypeScript interfaces for your data. You follow a strict typing convention where you separate the raw API responses from your clean frontend domain models.
*   **Convention:** Define `IRaw...` interfaces (e.g., `IRawBlogListResponse`) for exactly what the API returns, and `I...` interfaces (e.g., `IBlogListResponse`) for what the UI component will actually consume. Avoid using `any`.

### 2. `core/services/` (Fetching Logic)
This folder contains the actual API functions that execute HTTP requests (using Axios or Fetch).
*   **Convention:** Service functions are purely responsible for making the network request, catching errors, and returning the data. Use TypeScript generics here (e.g., `axios.get<IRawResponse>`) to ensure the returned data strictly matches the raw models defined in `core/models/`.
*   **Custom Builders:** Domain-specific logic, like payload builders or retry logic (e.g., `buildRetryPayload.ts`), lives alongside these services rather than cluttering up the UI components.

### 3. `core/query/` (State Management & Caching)
This directory holds data fetching hooks, built on top of React Query (`@tanstack/react-query`).
*   **Convention:** These hooks import the functions from `core/services/` and wrap them in `useQuery` or `useMutation`. This abstracts away loading states, error handling, caching, and background refetching from your UI components.

### 4. `app/api/` (Backend Routes)
Because you are using Next.js App Router, any backend API routes that need to run securely on the server (like handling file uploads to Backblaze B2 or talking to the Monday.com API with secret keys) are kept here.

---

## Client-Side vs. Server-Side API Calls

Because this project uses the Next.js App Router and React Query, the difference between server-side and client-side API calls is determined by **where the component renders** and **how you handle the data state**.

### 1. Client-Side API Calls
Client-side calls happen directly in the user's browser after the page has loaded. Use these for highly interactive features, form submissions, or polling for updates (like checking a generation status).

*   **Where it happens:** In components marked with the `"use client"` directive at the top of the file.
*   **How it's built:**
    *   Use the hooks inside **`core/query/`** (e.g., `useJobStatus`, `useRequestChangeMutation`).
    *   These hooks rely on `@tanstack/react-query` to handle loading states (`isLoading`), caching, and background refetching.
    *   They call the raw fetcher functions in **`core/services/`**.
*   **Example use case:** When a user clicks a "Generate 3D Model" button, a React Query `useMutation` (client-side) sends the request. You then use `useJobStatus` (client-side) to poll the API every few seconds to check if the 3D model is ready.

### 2. Server-Side API Calls
Server-side calls happen on your Node.js server *before* the HTML is sent to the user's browser. Use these for SEO, fast initial page loads, and accessing secure secrets (like your Monday.com or Backblaze B2 API keys) that shouldn't be exposed to the browser.

*   **Where it happens:**
    1.  **Server Components:** Any React component in `app/` that does *not* have `"use client"`. These components can be `async` functions.
    2.  **Route Handlers:** The files located in **`app/api/.../route.ts`**.
*   **How it's built:**
    *   **Direct Service Call:** You can import a function from **`core/services/`** directly into an `async` Server Component and `await` it.
    *   **React Query Prefetching:** Use functions like **`core/query/content/prefetchGetContent.ts`**. This is a classic Next.js 16 pattern where you make a server-side API call to pre-fetch the data on the server, load it into a React Query "dehydrated state", and pass it to the client so the page loads instantly with data.
*   **Example use case:** Fetching blog posts (`fetchGetBlogList`) or legal pages before the page renders. This ensures search engines can read the content (SEO) and the user doesn't see a loading spinner.

---

### Summary Table

| Feature | Client-Side API Call (`"use client"`) | Server-Side API Call (Server Component / `app/api`) |
| :--- | :--- | :--- |
| **Primary Tool** | `core/query/` hooks (`useQuery`, `useMutation`) | `async`/`await` direct calls or `prefetch...` |
| **Underlying Fetcher** | `core/services/` functions | `core/services/` functions |
| **Best For** | Polling, mutations (submitting forms), user interactions. | SEO-heavy pages, initial data loads, hiding API keys. |
| **Can access Env Vars?** | Only `NEXT_PUBLIC_...` variables. | Yes, all secret API keys. |
| **Loading State** | Handled by React Query (`isLoading`). | Handled by Next.js `loading.tsx` or Suspense. |

### Rule of Thumb
*   If the data changes based on immediate user interaction (like clicking a button or typing in a form), make a **Client-Side** call using `core/query/`.
*   If the data is required for the page to display properly when it first loads (like a blog article or legal text), make a **Server-Side** call directly in the page component or via your `prefetch` queries.

Most formatting and common issues are automatically fixed by Biome. Run `bun x ultracite fix` before committing to ensure compliance.

---

# Agent Documentation Update Rule

**Effective Immediately:**

When new rules or updates are assigned that affect agent documentation:

1. **Only update these specific files:**
   - `/Users/Ren/Documents/work/ren-architec/next-ai-boilerplate/AGENTS.md` (root level)
   - `/Users/Ren/Documents/work/ren-architec/next-ai-boilerplate/.claude/CLAUDE.md` 
   - `/Users/Ren/Documents/work/ren-architec/next-ai-boilerplate/GEMINI.md`

2. **Do NOT update:**
   - Any files in `.agents/skills/*/AGENTS.md`
   - Any other agent-specific markdown files in subdirectories

3. **Process:**
   - Read the new rule/content from the assignment
   - Update only the three specified root-level files
   - Maintain consistency across all three files
   - Use the exact content provided in the assignment

This rule ensures centralized documentation management while preventing unnecessary updates to skill-specific agent files.