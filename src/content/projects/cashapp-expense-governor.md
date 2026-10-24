---
title: "CashApp: Serverless Multi-Tenant Financial Telemetry & Expense Governor"
constraint: "Multi-tenant personal expense governor featuring sub-second two-tap logging, dual-mode dynamic budget smoothing, Hustle Mode v2.0 tactical sprints, and anomaly telemetry."
techStack: ["React 18", "TypeScript", "Tailwind CSS", "Cloudflare Pages", "Cloudflare D1", "Resend API", "PBKDF2-HMAC"]
date: 2026-10-23
demoVideoAvailable: false
---

> **Production Application:** [`https://cashapp.shagoto.me`](https://cashapp.shagoto.me) &bull; **Dev Telemetry Monitor:** [`https://dev.cashapp.shagoto.me`](https://dev.cashapp.shagoto.me) &bull; **Architecture:** Cloudflare Pages Functions + Cloudflare D1 (SQLite)

## The Constraint

Conventional personal finance applications suffer from severe interface friction and cognitive overhead. Logging a single in-the-moment purchase typically demands navigating multiple nested dropdowns, selecting accounts, typing merchant names, picking tags, and submitting multi-field forms. Consequently, user compliance breaks down precisely during periods of high-stress or impulsive spending.

For **`cashapp.shagoto.me`**, the mandate was to eliminate behavioral friction while establishing mathematical guarantees against budget overruns:
* **Zero-Scroll Lock-Screen Ergonomics:** The primary logging viewport fits strictly within `100dvh` on mobile with zero vertical scrolling and stationary dialpad anchoring.
* **Sub-3-Second Two-Tap Commits:** Action 1 types the amount on an oversized high-contrast numeric keypad; Action 2 taps one of six macro-categories (`Meal`, `Coffee`, `Groceries`, `Transit`, `Utility`, `Impulse`). Tapping a category button immediately registers the transaction, updates client state optimistically, resets the keypad, and buffers a 5-second undo toast.
* **In-the-Moment Pre-Spend Reasoning:** Rather than auditing damage retroactively, the client computes allowance degradation in real-time *as the user types*, displaying the exact mathematical consequence on tomorrow's daily allowance before committing.

---

## The Execution

`cashapp.shagoto.me` is built as an edge-native Single Page Application powered by Cloudflare Pages Functions and a serverless relational Cloudflare D1 database (`cashapp-db`).

### 1. Multi-Tenant Relational Isolation & Architecture

Data is partitioned per tenant via a unique `user_id` (`usr_<uuid>`). All edge queries enforce strict multi-tenant isolation with parameterized statements:

```sql
-- Multi-Tenant Partition Invariant
SELECT id, amount, category, behavioral_intent, payment_method, note, is_fixed, created_at 
FROM expenses 
WHERE user_id = ? AND date(created_at, '+6 hours') = date('now', '+6 hours')
ORDER BY created_at DESC;
```

All mutations use client-generated UUID v4 idempotency keys, guaranteeing that network retries across cellular connections never record duplicate financial events.

### 2. Two-Tier Passwordless Authentication Gate

The application completely eliminates fragile third-party authentication SDKs and insecure password databases, implementing a two-tier cryptographic challenge:
1. **Tier 1 (Email OTP):** The user enters their email address and receives a cryptographically generated 6-digit one-time code delivered via Cloudflare edge workers through the Resend API (`RESEND_API_KEY`). OTP hashes are verified using PBKDF2-HMAC-SHA256 (10,000 iterations) with a 16-byte unique salt and a 10-minute expiry.
2. **Tier 2 (5-Digit Numeric PIN):** Upon successful email verification, the user unlocks their session using a personal 5-digit PIN hashed via PBKDF2-HMAC-SHA256 (100,000 iterations). 
3. **Session Cookies & Brute-Force Rate Limiting:** A successful unlock issues an `HttpOnly; SameSite=Strict; Secure` session cookie signed with HMAC-SHA256. Failed login attempts are recorded against the client IP in an edge D1 table (`login_attempts`), automatically enforcing a 15-minute hard lockout after 5 consecutive failures.

### 3. Dual-Lens Financial Engine ("One Ledger, Two Lenses")

The core accounting engine provides two complementary behavioral lenses operating over the exact same underlying transaction ledger:

#### Lens 1: Monthly Smoothing Mode (Emerald Lens)
Absorbs spending surges smoothly across remaining days of the month ($D_{\text{rem}}$) in strict Asia/Dhaka time (`UTC+6`):
$$D_{\text{rem}} = \text{daysInMonth} - \text{dayOfMonth} + 1$$
$$A_{\text{today}} = \max\left(0, \frac{P_{\text{entering}}}{D_{\text{rem}}}\right)$$
* **Fixed Bills Firewall:** Recurring overheads (`bills_fixed`, e.g., rent and utilities) are isolated against a dedicated `fixed_bills_reserve` and strictly quarantined from the daily variable spending pool $P_{\text{entering}}$.
* **Budget Neutrality:** External reconciliations (`outside_pool`) are tracked for record completeness without corrupting the daily variable allowance.

#### Lens 2: Hustle Mode v2.0 (Flame Amber Tactical Lens)
For short-term spending sprints and emergency budget stabilization, Hustle Mode locks a fixed cash pool ($P_{\text{initial}}$) across a defined mission horizon ($D_{\text{sprint}}$):
$$A_{\text{hustle\_today}} = \max\left(0, \frac{P_{\text{initial}} + \Delta_{\text{sync}} - S_{\text{prior}}}{D_{\text{rem}}}\right)$$
* **Physical Cash Reconciler (`⚖️ Sync`):** Adjusts the pool to match physical cash in hand via `wallet_sync_delta` without fabricating fake expense entries.
* **Non-Destructive Invariant:** Switching between Monthly Mode and Hustle Mode, extending mission deadlines, or archiving completed sprints never alters, duplicates, or deletes underlying ledger rows.

### 4. StudioBridge Command Deck (`/studio`)

The StudioBridge desktop interface provides macro-financial administration:
* **Bilateral Debt & IOU Ledger:** Tracks receivables and liabilities (`they_owe_me` vs. `i_owe_them`) with automatic settlement waterfalls.
* **48-Hour Impulse Cooler Vault:** Diverts impulsive non-essential purchases into a 48-hour quarantine with automated countdown timers, recording resisted purchases as "Money Saved from Impulse."
* **AI Audit Exporter:** Generates structured exports in raw CSV, relational JSON, and high-density AI Audit Markdown pre-formatted for ingestion by large language model financial analyzers.

### 5. Dev Telemetry & Anomaly Watchdog (`dev.cashapp.shagoto.me`)

The platform includes an internal monitoring subproject deployed to Cloudflare Pages:
* **False Transaction Threshold Guard:** Separates valid spending statistics from accidental fat-finger entries (e.g., inadvertently typing ৳1,000,000 instead of ৳1,000) using a dynamic sensitivity threshold slider (default: ৳50,000).
* **Dual View Telemetry:** Displays Clean Spend (guarded analytics) alongside Raw Spend (unfiltered database totals) with an exact isolated delta.
* **Zero-Stale Version Heartbeat:** Client applications poll `version.json` in the background, automatically refreshing stale PWA service worker caches upon detecting a new deployment hash.

---

## Engineering Takeaways

`cashapp.shagoto.me` demonstrates that personal financial discipline is best governed at the edge. By combining sub-second lock-screen input ergonomics with cryptographic passwordless auth, multi-tenant relational partitioning on Cloudflare D1, and a dual-lens mathematical model, the application proves that software behavioral compliance is achieved through radical latency reduction and deterministic constraints.
