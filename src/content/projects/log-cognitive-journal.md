---
title: "Log: Zero-Trace Ephemeral Cognitive Journal"
constraint: "Zero-persistence ephemeral note architecture using Web Crypto envelope encryption (RSA-OAEP + AES-GCM) and volatile RAM state to minimize residual forensics on shared devices."
techStack: ["React 18", "TypeScript", "Tailwind CSS", "Cloudflare Pages", "Cloudflare D1", "Web Crypto API"]
date: 2026-10-20
demoVideoAvailable: false
---

> **System Endpoint:** `https://log.shagoto.me` &bull; **Ecosystem:** `shagoto.me` &bull; **Architecture:** Zero-Persistence React + Dual-Tier Cryptography + D1

## The Constraint

Modern note-taking tools and digital journals are architected on persistent caching and cloud synchronization. Even when sessions are logged out, persistent local storage (`localStorage`, `IndexedDB`, session tokens, SQLite caches) remains vulnerable to forensic extraction, browser session hijacking, and shoulder-surfing on public, university, or shared laboratory workstations.

For **`log.shagoto.me`**, the mandate was minimizing local forensics under a **Zero-Persistence Shared Device Workflow**:
* **Shared Terminal Safety:** A user can sit down at a shared computer, unlock the entry interface using a quick PIN, record cognitive thoughts and technical reflections, and close the tab without writing plaintext to browser disk storage (`localStorage`, `IndexedDB`, WebSQL, or cookies).
* **Asymmetric Ingestion Isolation:** Unlocking the write-only drop mode provides the browser runtime solely with an RSA public key. An attacker inspecting device memory during capture cannot decrypt past historical entries.
* **Strict Volatile-Only Storage Policy:** No passwords, decrypted notes, tokens, or private keys touch disk storage APIs. All active note manipulation lives strictly in volatile memory.

---

## The Execution

`log.shagoto.me` implements a two-tier cryptographic access model using the browser's native **Web Crypto API** (`window.crypto.subtle`) without third-party cryptographic dependencies.

### 1. Two-Tier Hybrid Envelope Encryption Model

The system decouples fast note ingestion from full archive reading through asymmetrical cryptography:

1. **Tier 1: Ghost Drop Mode (Quick Numeric PIN):**
   - Unlocked on public or borrowed terminals via a fast on-screen numpad.
   - Derives a key-encryption key using PBKDF2 ($200{,}000$ SHA-256 iterations) to retrieve the **RSA-OAEP 2048 Public Encryption Key** from Cloudflare D1.
   - For every submitted thought, the client generates a unique, single-use ephemeral **AES-GCM-256** symmetric key and a cryptographically secure 12-byte initialization vector (`crypto.getRandomValues`).
   - The entry is encrypted via AES-GCM-256, and the AES key is wrapped with the RSA public key before transmission to D1.
   - **Forensic Guarantee:** Because the RSA private key is never transmitted or held in memory during Tier 1, it is mathematically impossible to decrypt existing historical thoughts on the public device.

2. **Tier 2: Studio Bridge (Complex Master Passphrase):**
   - Executed only on trusted personal hardware.
   - Ingests the user's high-entropy master passphrase through PBKDF2 ($600{,}000$ iterations with a unique user salt) to derive the master un-wrapping key.
   - Decrypts the **RSA-OAEP 2048 Private Key** into volatile React state (`useRef`).
   - The client fetches the encrypted timeline, unwraps the individual AES-GCM keys in parallel, and decrypts the thoughts exclusively in memory.

### 2. Client-Side Cryptographic Pipeline Snippet

```typescript
// Single-use Ephemeral AES-GCM Encryption with RSA-OAEP Key Wrapping
async function encryptThoughtDrop(content: string, rsaPublicKey: CryptoKey) {
  // 1. Generate single-use symmetric AES-GCM-256 key
  const aesKey = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt']
  );

  // 2. Generate random 96-bit initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(content);

  // 3. Encrypt payload with AES-GCM
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encodedData
  );

  // 4. Wrap (encrypt) the AES key with the user's RSA-OAEP public key
  const exportedAesKey = await window.crypto.subtle.exportKey('raw', aesKey);
  const wrappedKeyBuffer = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    rsaPublicKey,
    exportedAesKey
  );

  return {
    ciphertext: bufferToBase64(ciphertextBuffer),
    iv: bufferToBase64(iv),
    wrappedKey: bufferToBase64(wrappedKeyBuffer)
  };
}
```

### 3. Strict Volatile-Only Memory Lifecycle

To prevent memory retention after session termination, all sensitive variables are held in transient closures. Triggering the Lock button (`🔒`) or navigating away invokes an immediate zero-fill wipe of internal cryptographic buffers, dropping all memory references before browser garbage collection.

### 4. Asia/Dhaka (UTC+6) Standardized Temporal Engine

All cognitive thoughts are grouped, searched, and rendered against a strict **Asia/Dhaka (UTC+6)** temporal clock regardless of the client machine's local system timezone. This eliminates fragmented daily logs caused by traveling or misconfigured terminal clocks.

### 5. Threat Model Boundaries

While client-side asymmetric envelope encryption and volatile memory policies protect against post-session local disk forensics and compromised cloud databases, they operate within clear boundary limits:
- **Client Integrity:** They do not protect against hardware keyloggers, malicious browser extensions installed on shared terminals, or operating system-level swap/pagefile inspection prior to process termination.
- **Scope:** The system is explicitly designed to defend against passive disk recovery and unauthorized cloud archive traversal, making shared terminal capture substantially safer than persistent web apps.

---

## Engineering Takeaways

By implementing client-side asymmetric envelope encryption natively in the browser, `log.shagoto.me` demonstrates how strict zero-persistence client policies and Web Crypto APIs can minimize forensic footprints on shared workstations without sacrificing capture speed.
