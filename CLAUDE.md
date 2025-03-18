# TapAssFun Project Guide

## Commands
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint
- `pnpm run preview` - Preview production build

## Code Style Guidelines
- **Imports**: Group imports by type (React, libraries, local components, types, CSS)
- **Formatting**: Use TypeScript strict mode and ESLint
- **Components**: Use functional React components with TypeScript interfaces for props
- **Naming**: Use PascalCase for components, camelCase for functions/variables
- **Types**: Define explicit TypeScript types/interfaces in types.ts
- **Error Handling**: Use try/catch blocks with console.error for API calls
- **State Management**: Use React Query for data fetching, React state for UI
- **Animation**: Use Framer Motion for animations
- **Styling**: Use Tailwind CSS with consistent class ordering
- **Layout**: Follow responsive design patterns (mobile-first approach)

## Tech Stack
- React with TypeScript
- TanStack React Query
- Tailwind CSS
- Framer Motion
- Vite