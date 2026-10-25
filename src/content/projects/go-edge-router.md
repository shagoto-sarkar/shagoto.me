---
title: "Go: Sub-15ms Dynamic Edge Router & Bang Engine"
constraint: "Personal dynamic redirect engine designed for sub-15ms edge latency, non-blocking asynchronous telemetry, and zero database lookups on hot paths."
techStack: ["Cloudflare Workers", "TypeScript", "Hono", "Workers KV", "Cloudflare D1", "Web Crypto API"]
date: 2026-10-16
demoVideoAvailable: false
---

> **System Endpoint:** `https://go.shagoto.me` &bull; **Ecosystem:** `shagoto.me` &bull; **Architecture:** Cloudflare Workers (V8 Isolates) + Hono + KV Cache + D1

## The Constraint

Traditional URL shorteners and redirect services rely on centralized database architectures and heavy server-side frameworks. Every redirect incurs cold start penalties, cross-region TLS handshakes, and blocking analytics writes that delay page transitions by 200–600ms.

For **`go.shagoto.me`**, the primary engineering directive was ultra-low-latency edge execution:
* **Edge Routing Target:** Resolving requests at the nearest edge Point of Presence (PoP) in Cloudflare's global network without querying centralized origin databases on hot paths.
* **Non-Blocking Telemetry:** Analytics recording (IP-less geocoding, user agent parsing, referral source, timestamp) must run strictly off the critical path via background execution, adding $0\text{ ms}$ user-perceived overhead to the HTTP redirect.
* **CLI-First Ergonomics:** First-class management through Linux shell pipelines via standard `curl` commands, supporting instant link creation, updates, and format negotiation.

---

## The Execution

`go.shagoto.me` is built using the **Hono** web framework running on Cloudflare Workers, combining an ultra-fast in-memory routing engine ($\sim 14\text{ KB}$ runtime overhead) with a hybrid two-tier storage layer.

### 1. Hybrid KV + D1 Storage Architecture

To achieve sub-15ms execution on common paths while preserving relational auditability, storage is split into complementary tiers:
1. **Hot Path (Workers KV):** Global key-value cache with low single-digit millisecond read latencies. The edge worker resolves incoming slugs (`/cv`, `/thesis`, `/meet`) directly from KV cache without querying the relational layer.
2. **Cold & Relational Tier (Cloudflare D1):** Serverless SQLite acting as the authoritative source of truth. Handles structured metadata, link updates, access control verification, and click telemetry streams.
3. **Cache Model & Invalidation:** When a link destination is updated via API or CLI, the worker writes the change to D1 and updates the corresponding KV key. Because Workers KV operates on an eventually-consistent replication model (propagating globally within ~60 seconds), hot paths trade strict global instant serializability for deterministic low-latency edge reads.

### 2. Parameterized "Bang" Routing Engine

To eliminate lookups entirely for standardized destinations, `go.shagoto.me` implements deterministic pattern-matched "bang" routes evaluated in V8 memory with 0ms database overhead:

```typescript
import { Hono } from 'hono';

const app = new Hono();

// Algorithmic Bang Rules (Zero Storage Overhead)
const BANG_PATTERNS: Record<string, (arg: string) => string> = {
  gh: (repo) => `https://github.com/shagoto-sarkar/${repo}`,
  arxiv: (id) => `https://arxiv.org/abs/${id}`,
  doi: (doi) => `https://doi.org/${doi}`,
  yt: (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
};

app.get('/:prefix/:arg', async (c) => {
  const { prefix, arg } = c.req.param();
  const rule = BANG_PATTERNS[prefix.toLowerCase()];

  if (rule) {
    const destination = rule(arg);
    // Asynchronous non-blocking telemetry dispatch
    c.executionCtx.waitUntil(recordTelemetry(c, `bang:${prefix}`, destination));
    return c.redirect(destination, 302);
  }

  return c.notFound();
});
```

### 3. Non-Blocking Edge Telemetry via `ctx.waitUntil()`

Click telemetry is decoupled completely from the visitor's HTTP response. Using the Cloudflare Worker execution context (`c.executionCtx.waitUntil`), the worker schedules an asynchronous background promise to write the telemetry payload to D1 after the HTTP 302/301 response stream has terminated.

### 4. Dynamic In-Memory SVG QR Code Matrix

For physical-to-digital workflows (e.g., conference presentations, academic posters, CV headers), appending `.qr` to any slug (e.g., `https://go.shagoto.me/cv.qr`) instructs the worker to dynamically compute the QR Reed-Solomon error correction matrix and stream an inline scalable SVG directly from V8 memory with zero native image library dependencies.

---

## Engineering Takeaways

By treating URL routing as an edge-native problem and leveraging non-blocking isolate threads, `go.shagoto.me` delivers instantaneous personal link navigation while gathering rich operational telemetry without degrading visitor experience.
