# Taproot Assets MVP Plan

## Current State Analysis

### What's Real
| Data | Source | Notes |
|------|--------|-------|
| Token names | Lightning Finance API | `/universe/roots` endpoint |
| Token IDs | Lightning Finance API | `asset_id` from API |
| Token supply | Lightning Finance API | `root_sum` from API |

### What's Fake (Simulated)
| Data | Source | Notes |
|------|--------|-------|
| Symbol | faker.js | Random 3-letter string |
| Price | faker.js | $0.00001 - $1000 random |
| 24h Change | faker.js | -50% to +50% random |
| Volume | faker.js | $10k - $1M random |
| Market Cap | faker.js | $100k - $10M random |
| Live updates | setInterval | ±2.5% every 1-8 seconds |

### UI-Only (Non-functional)
- **Connect Wallet** button - no handler
- **Trade** button - no handler
- No token detail pages
- No authentication
- No actual buy/sell/mint flows

---

## Available APIs & Tools

### 1. Universe APIs (Read-Only, No Auth)

**Public Endpoints** - Already partially integrated:
```
GET https://universe.lightning.finance/v1/taproot-assets/universe/roots
GET https://universe.lightning.finance/v1/taproot-assets/universe/leaves/asset-id/{id}
GET https://universe.lightning.finance/v1/taproot-assets/universe/stats
```

**Alternative Universe Servers** (for redundancy):
- `assets.megalith-node.com`
- `universe.tiramisuwallet.com`
- `universe.nostrassets.com`

### 2. Lnfi Network SDK
**Docs**: https://docs.lnfi.network/sdk-api/api

Features:
- Asset issuance (minting)
- P2P marketplace
- Order book exchange
- Nostr authentication

### 3. Price Oracle
**Docs**: https://docs.ln.exchange/price-oracle

- Real-time pricing data
- Trading pair rates
- Historical data

### 4. Taproot Assets Daemon (tapd)
**For advanced self-hosted operations**:
- gRPC API on port 10029
- REST API on port 8089
- Requires running LND + Bitcoin node

### 5. Wallet SDKs
| SDK | Features | Best For |
|-----|----------|----------|
| **Joltz SDK** | Self-custodial, native TA | Full wallet integration |
| **Speed Wallet** | USDT-L, stablecoins | Stablecoin focus |
| **Lnfi SDK** | Trading, issuance | Marketplace features |

---

## MVP Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
├─────────────────────────────────────────────────────────┤
│  Token List  │  Token Details  │  Mint  │  Trade/Swap   │
└──────┬───────┴────────┬────────┴────┬───┴───────┬───────┘
       │                │             │           │
       ▼                ▼             ▼           ▼
┌──────────────┐  ┌───────────┐  ┌─────────┐  ┌─────────┐
│  Universe    │  │  Price    │  │  Lnfi   │  │  Lnfi   │
│  API (read)  │  │  Oracle   │  │  SDK    │  │  SDK    │
└──────────────┘  └───────────┘  └─────────┘  └─────────┘
                                      │           │
                                      ▼           ▼
                              ┌─────────────────────────┐
                              │  Nostr (Auth + Social)  │
                              └─────────────────────────┘
```

---

## Phased Implementation Plan

### Phase 1: Real Data Foundation
**Goal**: Replace all fake data with real API data

#### 1.1 Enhanced Token List
- [ ] Use `universe/leaves` endpoint to get more token metadata
- [ ] Implement multi-universe fallback for reliability
- [ ] Cache responses with React Query (already configured)

#### 1.2 Real Pricing Data
- [ ] Integrate LN Exchange price oracle API
- [ ] Fetch real trading pair prices
- [ ] Display actual market data (or "N/A" if no market exists)

#### 1.3 Token Detail Pages
- [ ] Create `/token/:id` route
- [ ] Fetch full token details from universe API
- [ ] Display: supply, issuance info, holder count (if available)
- [ ] Transaction history from universe leaves

**Deliverable**: Token explorer with 100% real data

---

### Phase 2: Authentication & Wallet
**Goal**: User identity and wallet connection

#### 2.1 Nostr Authentication
- [ ] Integrate NIP-07 browser extension support (Alby, nos2x)
- [ ] Implement Lnfi SDK Nostr auth flow
- [ ] Store user session (npub, pubkey)
- [ ] Display connected user info in header

#### 2.2 Wallet Connection
- [ ] Integrate Lnfi SDK wallet features
- [ ] Display user's Taproot Asset balances
- [ ] Show Lightning balance (sats)

**Deliverable**: Users can log in with Nostr and see their balances

---

### Phase 3: Token Minting
**Goal**: Users can create new Taproot Assets

#### 3.1 Mint Form UI
- [ ] Token name input
- [ ] Symbol input
- [ ] Total supply input
- [ ] Metadata fields (description, image URL)
- [ ] Grouped asset toggle (for ongoing emission)

#### 3.2 Minting Integration
- [ ] Connect to Lnfi SDK minting API
- [ ] Calculate minting fee
- [ ] Lightning invoice generation
- [ ] Payment flow (QR code + webln)
- [ ] Confirmation & success screen

#### 3.3 Post-Mint Actions
- [ ] Publish Nostr announcement (NIP-XX attestation)
- [ ] Auto-register with universe servers
- [ ] Redirect to new token page

**Deliverable**: Users can mint tokens and pay via Lightning

---

### Phase 4: Trading (Buy/Sell)
**Goal**: Users can trade Taproot Assets

#### 4.1 Order Book Integration
- [ ] Connect to Lnfi order book API
- [ ] Display current bids/asks
- [ ] Show recent trades
- [ ] Real-time updates (WebSocket if available)

#### 4.2 Buy Flow
- [ ] Select token & amount
- [ ] Get RFQ (request for quote)
- [ ] Show price & fees
- [ ] Generate Lightning invoice
- [ ] Process payment
- [ ] Confirm receipt of tokens

#### 4.3 Sell Flow
- [ ] Select token & amount from wallet
- [ ] Get RFQ quote
- [ ] Initiate atomic swap
- [ ] Receive sats/stablecoin

#### 4.4 Simple Swap UI
- [ ] "I have X, I want Y" interface
- [ ] Best price routing
- [ ] Slippage tolerance setting

**Deliverable**: Users can buy/sell tokens for sats

---

### Phase 5: Social Features
**Goal**: Community and engagement features

#### 5.1 Token Discussion
- [ ] Nostr-based comment threads (NIP-XX)
- [ ] Reply to token with ownership proof
- [ ] Render as chat/feed on token page

#### 5.2 Holder Verification
- [ ] Optional proof of ownership in posts
- [ ] Badge/indicator for verified holders
- [ ] Holder count & distribution

#### 5.3 Notifications
- [ ] Price alerts
- [ ] New token announcements
- [ ] Trade confirmations

**Deliverable**: Social layer for token communities

---

## Technical Implementation Details

### API Integration Code Structure

```typescript
// src/api/universe.ts - Enhanced universe API
export const universeApi = {
  getRoots: () => fetch('/universe/roots'),
  getLeaves: (assetId: string) => fetch(`/universe/leaves/asset-id/${assetId}`),
  getStats: () => fetch('/universe/stats'),
};

// src/api/pricing.ts - Price oracle integration
export const pricingApi = {
  getPrice: (assetId: string) => fetch(`/price/${assetId}`),
  getPairs: () => fetch('/pairs'),
};

// src/api/lnfi.ts - Lnfi SDK wrapper
export const lnfiApi = {
  auth: {
    login: () => {}, // Nostr NIP-07
    logout: () => {},
  },
  wallet: {
    getBalances: () => {},
    getAddress: () => {},
  },
  mint: {
    createAsset: (params) => {},
    finalize: (batchId) => {},
  },
  trade: {
    getQuote: (params) => {},
    executeTrade: (quoteId) => {},
  },
};
```

### New Types

```typescript
// src/types.ts additions

interface TokenDetails extends TokenInfo {
  metadata?: {
    description?: string;
    image?: string;
    website?: string;
  };
  issuanceDate?: string;
  genesisPoint?: string;
  groupKey?: string;
  holderCount?: number;
}

interface PriceData {
  assetId: string;
  priceUsd: number;
  priceSats: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  lastUpdate: string;
}

interface User {
  npub: string;
  pubkey: string;
  balances: AssetBalance[];
}

interface AssetBalance {
  assetId: string;
  amount: number;
}

interface TradeQuote {
  quoteId: string;
  fromAsset: string;
  toAsset: string;
  rate: number;
  fee: number;
  expiresAt: string;
}
```

### New Routes

```typescript
// Suggested route structure
/                     - Token list (existing)
/token/:id            - Token details page
/token/:id/trade      - Trade interface
/mint                 - Mint new token
/wallet               - User wallet & balances
/profile/:npub        - User profile
```

---

## Key Dependencies to Add

```json
{
  "dependencies": {
    // Nostr
    "nostr-tools": "^2.x",

    // Lightning payments
    "webln": "^0.3.x",

    // Lnfi SDK (check docs for exact package)
    "@lnfi/sdk": "^x.x.x",

    // QR codes for invoices
    "qrcode.react": "^3.x",

    // Routing
    "react-router-dom": "^6.x"
  }
}
```

---

## Risk Assessment

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Lnfi API changes | High | Abstract API layer, version pin |
| No JS SDK available | Medium | Use REST directly, build wrapper |
| Price data unavailable | Medium | Graceful fallback to "N/A" |
| Wallet integration complexity | High | Start with view-only, add write ops later |

### Product Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Low liquidity | High | Focus on minting first, trading later |
| Mainnet vs testnet | Medium | Build on testnet, easy switch |
| Regulatory uncertainty | Medium | Research jurisdiction requirements |

---

## Recommended MVP Scope

For a **minimal viable product**, focus on:

### Must Have (Phase 1-2)
1. ✅ Real token list (already have)
2. Real token details page
3. Nostr login
4. View-only wallet balances

### Should Have (Phase 3)
5. Token minting with Lightning payment
6. Nostr attestation posts

### Nice to Have (Phase 4-5)
7. Basic buy/sell (after establishing liquidity source)
8. Social features

---

## Next Steps

1. **Validate Lnfi SDK access** - Sign up, get API keys, test endpoints
2. **Implement token detail page** - Use existing `getTokenDetails` function
3. **Add Nostr auth** - NIP-07 extension support
4. **Build mint form** - Start with testnet

Would you like me to start implementing any of these phases?
