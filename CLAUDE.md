# TapAssFun Project Guide

## Project Overview

TapAssFun is a React-based web application for discovering and interacting with Taproot Assets on the Bitcoin Lightning Network. The app provides a fun, animated interface for viewing token information fetched from the Lightning Finance universe API.

**Key Features:**
- Real-time token data display with simulated price updates
- Animated token cards with Framer Motion
- Responsive design (mobile-first approach)
- Integration with Taproot Assets Universe API
- GitHub Pages deployment

## Project Structure

```
TapassFun/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment workflow
├── public/
│   ├── preview.png             # OG image for social media
│   └── preview.svg             # Preview image
├── src/
│   ├── api/
│   │   └── tokens.ts           # API layer for fetching Taproot Assets data
│   ├── components/
│   │   ├── Footer.tsx          # Footer component with GitHub link
│   │   └── TokenCard.tsx       # Animated token card component
│   ├── hooks/
│   │   └── useTokens.ts        # React Query hooks for data fetching
│   ├── lib/
│   │   └── react-query.ts      # React Query configuration
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles and Tailwind directives
│   ├── main.tsx                # Application entry point
│   ├── types.ts                # TypeScript type definitions
│   └── vite-env.d.ts           # Vite environment types
├── CLAUDE.md                   # This file - AI assistant guide
├── README.md                   # Project README
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template with meta tags
├── package.json                # Project dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── todos.md                    # Development roadmap
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # App-specific TypeScript config
├── tsconfig.node.json          # Node-specific TypeScript config
└── vite.config.ts              # Vite bundler configuration
```

## Tech Stack

### Core Technologies
- **React 18.3.1**: UI library with functional components and hooks
- **TypeScript 5.5.3**: Type-safe JavaScript with strict mode enabled
- **Vite 5.4.2**: Fast build tool and dev server

### State Management & Data Fetching
- **TanStack React Query 5.66.9**: Server state management
  - Configured with 1-minute stale time
  - Window focus refetching disabled
  - Location: `src/lib/react-query.ts`

### Styling & Animation
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Framer Motion 11.0.8**: Animation library for React
- **Lucide React 0.344.0**: Icon library

### Development Tools
- **ESLint 9.9.1**: Linting with TypeScript and React plugins
- **PostCSS & Autoprefixer**: CSS processing
- **pnpm**: Package manager

### APIs & Data
- **@faker-js/faker 8.4.1**: Mock data generation
- **Lightning Finance API**: Real Taproot Assets data
  - Base URL: `https://universe.lightning.finance/v1/taproot-assets`

## Commands

```bash
# Development
pnpm run dev           # Start Vite dev server on localhost:5173

# Production
pnpm run build         # Build for production (outputs to dist/)
pnpm run preview       # Preview production build locally

# Code Quality
pnpm run lint          # Run ESLint on all TypeScript files

# Package Management
pnpm install           # Install dependencies
```

## Code Style Guidelines

### Import Organization
Group imports in this order:
1. React imports
2. Third-party libraries
3. Local components
4. Types
5. CSS/Styles

Example:
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { TokenCard } from './components/TokenCard';
import { Token } from './types';
import './index.css';
```

### TypeScript Conventions
- **Strict mode enabled**: All TypeScript strict checks are on
- **Type definitions**: Store shared types in `src/types.ts`
- **Interface naming**: Use PascalCase (e.g., `TokenInfo`, `Token`)
- **Props interfaces**: Suffix with `Props` (e.g., `TokenCardProps`)
- **Explicit typing**: Always define return types for functions and props

### Component Patterns
- **Functional components only**: Use React.FC with TypeScript interfaces
- **Named exports**: Use named exports for components (e.g., `export const Footer`)
- **Props destructuring**: Destructure props in function parameters
- **Naming conventions**:
  - Components: PascalCase (`TokenCard`, `Footer`)
  - Functions/variables: camelCase (`useTokens`, `queryClient`)
  - Constants: SCREAMING_SNAKE_CASE or camelCase (`Universes`, `tokensApi`)

### Styling with Tailwind
- **Class ordering**: Follow consistent pattern (layout → spacing → colors → typography → effects)
- **Responsive design**: Mobile-first breakpoints (sm, md, lg)
- **Color scheme**: Dark theme with gray-900 base, purple accents
- **Custom scrollbar**: Defined in `index.css` with purple theme
- **Utility classes**: Prefer Tailwind utilities over custom CSS

### Animation Guidelines
- **Library**: Use Framer Motion for all animations
- **Common patterns**:
  - `whileHover={{ scale: 1.05 }}` for interactive elements
  - `whileTap={{ scale: 0.95 }}` for buttons
  - `initial`, `animate`, `transition` for page/component entry
  - `useAnimation()` for programmatic control
- **Performance**: Animate transform and opacity properties for best performance

### Error Handling
- **API calls**: Wrap in try/catch blocks with console.error
- **React Query**: Handles errors automatically, access via `isError` and `error`
- **Type safety**: Use TypeScript to prevent runtime errors

### State Management
- **Server state**: Use React Query for all API data
- **UI state**: Use React hooks (useState, useEffect, useMemo)
- **No global state**: Component-local state unless shared needed

## Key Files Explained

### `src/App.tsx`
Main application component that:
- Fetches token list using `useTokens(20)` hook
- Displays loading state with animated spinner
- Renders header with logo and "Connect Wallet" button
- Maps tokens to `TokenCard` components in responsive grid
- Shows live token count in bottom-right corner
- Includes Footer component

### `src/components/TokenCard.tsx`
Highly animated token card component featuring:
- **Real-time simulation**: Updates token values every 1-8 seconds
- **Multi-element animations**: Separate animation controls for price, volume, market cap, icon, and card
- **Visual feedback**: Color flashes (green/red), rotations, scaling, and blur effects on value changes
- **Props**: Accepts `TokenInfo` object with id, name, and supply
- **Data flow**: Uses `generateToken()` to create full Token object from TokenInfo
- **Animations**: Violent distortions and rotations when values change
- **Stats displayed**: Price, 24h change, volume, market cap

### `src/api/tokens.ts`
API layer with two main functions:
- **`getTokens(count)`**: Fetches token list from Lightning Finance universe
  - Endpoint: `/v1/taproot-assets/universe/roots`
  - Extracts: `asset_name`, `asset_id`, `root_sum` (supply)
  - Returns: `TokenInfo[]`
- **`getTokenDetails(id)`**: Fetches detailed token data (currently unused)
  - Endpoint: `/v1/taproot-assets/universe/leaves/asset-id/${id}`
- **`generateToken()`**: Creates full Token object with faker.js for missing data

### `src/hooks/useTokens.ts`
React Query hooks for data fetching:
- **`useTokens(count)`**: Query hook for token list
  - Query key: `["tokens", count]`
  - Returns: `TokenInfo[]`
- **`useTokenDetails(id)`**: Query hook for single token (currently unused)
  - Query key: `["tokenDetails", id]`
  - Returns: `Token`

### `src/types.ts`
TypeScript type definitions:
- **`Token`**: Full token object with all fields
  - id, name, symbol, price, change24h, volume24h, marketCap, lastUpdate, supply
- **`TokenInfo`**: Minimal token data from API
  - Pick<Token, "id" | "name" | "supply">

### `index.html`
HTML template with comprehensive meta tags:
- Favicon: SVG rocket icon with dark background
- Open Graph tags for social media sharing
- Twitter card tags
- Theme color: #171717 (gray-900)
- Preview image: `/preview.png`

## API Integration

### Lightning Finance Universe API

**Base URL**: `https://universe.lightning.finance/v1/taproot-assets`

**Endpoints Used**:
1. **Universe Roots** (Token List)
   - Path: `/universe/roots`
   - Method: GET
   - Response: Object with `universe_roots` containing token data
   - Fields extracted: `asset_name`, `id.asset_id`, `mssmt_root.root_sum`

2. **Universe Leaves** (Token Details)
   - Path: `/universe/leaves/asset-id/${id}?proof_type=PROOF_TYPE_ISSUANCE`
   - Method: GET
   - Status: Implemented but not currently used in UI

**Data Flow**:
1. React Query calls `tokensApi.getTokens(count)`
2. API fetches from Lightning Finance
3. Response mapped to `TokenInfo[]`
4. TokenCard receives TokenInfo, generates full Token with faker.js
5. Simulated updates occur every 1-8 seconds per card

## Component Architecture

### Component Hierarchy
```
App
├── Header (inline)
│   ├── Logo with animation
│   └── Connect Wallet button
├── Main
│   └── TokenCard[] (grid)
│       ├── Token header (icon, name, symbol, Trade button)
│       └── Stats grid (4 boxes)
│           ├── Price
│           ├── 24h Change
│           ├── Volume
│           └── Market Cap
└── Footer
    ├── Copyright
    └── GitHub link
```

### Animation Patterns

**Entry Animations**:
```typescript
// Page elements
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Continuous pulse
animate={{ scale: [1, 1.05, 1] }}
transition={{ repeat: Infinity, duration: 2 }}
```

**Interactive Animations**:
```typescript
// Buttons
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Cards
whileHover={{ scale: 1.05 }}
```

**Programmatic Animations** (TokenCard):
```typescript
const controls = useAnimation();

// Trigger on value change
controls.start({
  scale: [1, 1.3, 0.8, 1.1, 1],
  rotate: [0, -2, 3, -1, 0],
  backgroundColor: ["rgba(...)", "rgba(...)", "rgba(...)"],
  transition: { duration: 0.7, ease: "easeOut" }
});
```

### State Management Patterns

**Data Fetching**:
```typescript
// In component
const { data: tokens = [], isLoading } = useTokens(20);

// Loading state
if (isLoading) return <LoadingSpinner />;

// Render data
return <TokenGrid tokens={tokens} />;
```

**Local State** (TokenCard simulation):
```typescript
const [simulatedToken, setSimulatedToken] = useState<typeof token>();

useEffect(() => {
  const intervalId = setInterval(() => {
    setSimulatedToken(/* updated values */);
  }, 1000 + Math.random() * 7000);

  return () => clearInterval(intervalId);
}, [token]);
```

## Deployment

### GitHub Pages Workflow

**Trigger**: Push to any branch
**Deployment**: Only on `main` branch

**Build Process**:
1. Checkout code
2. Setup Node.js 20 and pnpm 8
3. Install dependencies: `pnpm install`
4. Build: `pnpm build` (outputs to `dist/`)
5. Upload build artifact (main branch only)
6. Deploy to GitHub Pages (main branch only)

**Permissions Required**:
- `contents: read`
- `pages: write`
- `id-token: write`

**Live URL**: https://tapass.fun/

### Build Configuration

**Vite config** (`vite.config.ts`):
- Base path: `/`
- React plugin enabled
- Lucide-react excluded from optimization (bundled separately)

## Future Development

Based on `todos.md`, planned features include:

### Data & APIs
- [ ] Real pricing data from LN Exchange API
- [ ] WebSocket streaming for real-time trade updates
- [ ] Replace faker.js simulations with live data

### Authentication
- [ ] Nostr login integration via LN Finance SDK

### Token Creation
- [ ] Create token form (fields based on Tiramisu wallet)
- [ ] Payment flow on Bitcoin testnet4
- [ ] Nostr attestation posts on token creation

### Social Features
- [ ] Nostr-based metadata updates
- [ ] Comment/reply system via Nostr notes
- [ ] Optional ownership proofs in replies
- [ ] Chat feed for token discussions

### Token Detail Pages
- [ ] Transaction log
- [ ] TradingView chart iframe
- [ ] Buy/sell flow
- [ ] Holder distribution charts
- [ ] Enhanced metrics (market cap, volume, holder count)
- [ ] Lightning Network data integration
- [ ] Livestream functionality

## Best Practices for AI Assistants

### When Making Changes

1. **Read before editing**: Always use Read tool on files before modifying
2. **Preserve patterns**: Match existing code style and patterns
3. **Type safety**: Maintain TypeScript strict mode compliance
4. **Test locally**: Suggest running `pnpm run dev` to test changes
5. **Lint**: Run `pnpm run lint` before committing

### Common Tasks

**Adding a new component**:
1. Create file in `src/components/` with PascalCase name
2. Use `React.FC<Props>` pattern with interface
3. Import types from `src/types.ts`
4. Use Framer Motion for animations
5. Export as named export

**Adding an API endpoint**:
1. Add function to `src/api/tokens.ts`
2. Create React Query hook in `src/hooks/useTokens.ts`
3. Update types in `src/types.ts` if needed
4. Use try/catch with console.error

**Updating styles**:
1. Prefer Tailwind utilities over custom CSS
2. Add custom CSS to `src/index.css` if absolutely necessary
3. Maintain dark theme (gray-900 + purple accents)
4. Test responsive breakpoints

**Debugging issues**:
1. Check browser console for errors
2. Verify API responses in Network tab
3. Use React DevTools for component state
4. Check React Query DevTools for cache state

### Things to Avoid

- ❌ Creating global state management (Redux, Zustand) - use React Query
- ❌ Installing additional UI libraries - use Tailwind + Framer Motion
- ❌ Inline styles - use Tailwind classes
- ❌ Class components - use functional components only
- ❌ Prop drilling - create hooks for shared data
- ❌ Fetching in useEffect - use React Query hooks
- ❌ Custom scrollbars beyond what's in index.css
- ❌ Breaking TypeScript strict mode

### Git Workflow

**Branch naming**: Feature branches should use descriptive names
**Commits**: Write clear, descriptive commit messages
**Main branch**: Protected, deploys automatically to GitHub Pages
**Testing**: All branches build automatically via GitHub Actions

## Questions to Ask

When implementing new features, consider asking:
- Should this data come from the API or be simulated?
- Does this need animation? What's the appropriate level?
- Is this UI state or server state?
- How does this work on mobile devices?
- Does this integrate with the existing Nostr/Lightning plans?
