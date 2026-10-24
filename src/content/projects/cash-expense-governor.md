---
title: "Cash: Serverless Personal Expense Governor"
constraint: "Zero-scroll mobile lock-screen ergonomics delivering sub-3-second two-tap expense logging with pre-spend mathematical damage computation."
techStack: ["React 18", "TypeScript", "Tailwind CSS", "Cloudflare Pages", "Cloudflare D1", "Web Crypto API"]
date: 2026-10-15
demoVideoAvailable: false
---

> **System Endpoint:** `https://cash.shagoto.me` &bull; **Ecosystem:** `shagoto.me` &bull; **Architecture:** Cloudflare Edge Functions + D1 SQLite

## The Constraint

Conventional personal finance applications fail in real-world conditions due to excessive interface friction. Logging a single purchase typically requires navigating through 6–8 nested form controls across multiple viewports—selecting payment accounts, typing merchant names, picking subcategories, and tagging transactions. Consequently, user compliance degrades precisely during periods of impulse spending.

For **`cash.shagoto.me`**, the mandate was to eliminate all behavioral friction through strict ergonomic constraints:
* **Zero-Scroll Lock-Screen Ergonomics:** The primary logging view must fit completely within `100dvh` on mobile without any vertical scrollbar.
* **Sub-3-Second Two-Tap Commits:** Action 1 types the amount on an oversized high-contrast numeric keypad; Action 2 taps one of six macro-categories (`Meal`, `Coffee`, `Groceries`, `Transit`, `Utility`, `Impulse`). The tap immediately registers the commit, updates client state optimistically, resets the keypad, and displays a 5-second undo toast.
* **In-the-Moment Pre-Spend Reasoning:** Rather than reviewing damage after spending, the interface computes mathematical consequences in real-time *as the user types the number*, before the commit action.

---

## The Execution

`cash.shagoto.me` is built as an edge-native Single Page Application powered by Cloudflare Pages Functions and Cloudflare D1 (serverless SQLite at edge PoPs).

### 1. Dual-Interface System Topology

The application divides financial operations into two distinct operational modes:
1. **Simple Pulse Mode (`/`):** A zero-scroll mobile dashboard prioritizing rapid capture, the daily safe-to-spend allowance meter, behavioral intent tagging, and an immediate 48-hour impulse cooler.
2. **Studio Bridge (`/studio`):** A comprehensive desktop-ready configuration hub managing active debt and IOU ledgers (`I Owe` vs. `Owed to Me`), variable monthly budget allocation, fixed recurring reserves, and multi-format structured exports (`.CSV`, `.JSON`, and automated `.MD` AI audit reports).

### 2. Pre-Spend Mathematical Formulation

The dynamic damage engine recalculates allowance degradation synchronously on keypress before committing:

```typescript
interface BudgetState {
  monthlyVariableBudget: number;
  fixedBillsReserve: number;
  spentMonthToDate: number;
  daysRemainingInMonth: number;
}

function computePreSpendImpact(amount: number, state: BudgetState) {
  const currentSafeToday = Math.max(
    0,
    (state.monthlyVariableBudget - state.spentMonthToDate) / state.daysRemainingInMonth
  );

  const delta = currentSafeToday - amount;
  const isOverBudgetToday = delta < 0;

  // Compute daily allowance reduction for remainder of billing cycle
  const futureDailyAllowance = Math.max(
    0,
    (state.monthlyVariableBudget - (state.spentMonthToDate + amount)) /
      Math.max(1, state.daysRemainingInMonth - 1)
  );

  return {
    currentSafeToday,
    remainingToday: delta,
    isOverBudgetToday,
    deficitToday: isOverBudgetToday ? Math.abs(delta) : 0,
    futureDailyAllowance,
    degradationPercentage: ((currentSafeToday - futureDailyAllowance) / currentSafeToday) * 100
  };
}
```

### 3. Behavioral Impulse Cooler & Intent Tagging

To combat emotional buying patterns, the interface features a 1-tap intent selector (`🟢 Need`, `🟡 Want`, `🔴 Impulse`). When evaluating non-essential goods, the user can trigger **`[🧊 Park 48h]`**, immediately diverting the purchase into a cooldown vault. The item is tracked as "Money Saved from Impulse" until 48 hours elapse, enforcing an emotional cooling-off period before actual funds leave the account.

### 4. Zero-Dependency Cryptographic Authentication

Session authorization bypasses third-party auth platforms entirely. Using the browser's native **Web Crypto API** (`crypto.subtle`), the client exchanges a 4-digit numeric PIN for an HMAC-SHA256 authenticated session token verified by edge functions against edge environment secrets and stored in an `HttpOnly; SameSite=Strict; Secure` cookie.

---

## Engineering Takeaways

By pairing Cloudflare Pages edge functions with SQLite on D1 and strict `100dvh` mobile ergonomics, `cash.shagoto.me` proves that behavioral compliance in software is primarily a function of latency reduction and cognitive ergonomics rather than feature density.
