---
title: "SerialNow: Outpatient Queue Arbitration System"
constraint: "Deterministic dual-lane batch rotation and sub-second receptionist ergonomics governing outpatient flow in single-doctor chambers with zero-PII patient transparency."
techStack: ["React 19", "TypeScript", "Vite", "Axe Core", "Playwright", "Vitest", "Cloudflare Workers (Planned)"]
date: 2026-10-25
demoVideoAvailable: false
---

> **System Endpoint:** [`https://serialnow.shagoto.me`](https://serialnow.shagoto.me) &bull; **Publisher:** S.goto Lab &bull; **Development Codename:** `phantom` &bull; **Philosophy:** *"Clarity in the waiting."*

## The Constraint

In outpatient medical chambers throughout Bangladesh, single-doctor practices operate under extreme queue pressure. Receptionists—often educated assistants or medical apprentices of the consulting physician—face continuous, repetitive interruptions from anxious patients (*"Koto serial cholche?"*, *"Ami kokhon jabo?"*). Meanwhile, crowded waiting rooms foster suspicion of queue jumping and arbitrary delays.

Conventional healthcare management and hospital ERP platforms fail in this operational reality because they impose high technological barriers on vulnerable end users:
* **Digital Compulsion Anti-Pattern:** Forcing sick, elderly, or tech-averse patients to install mobile applications, register accounts, or scan smartphone QR codes merely to be seen creates severe adoption failure.
* **Receptionist Friction:** Complex administrative forms with redundant dropdowns slow down physical intake, causing receptionists to abandon software during peak hours.
* **Opaque Hallucinated ETAs:** Estimating appointment arrival times with simplistic countdown timers damages patient trust when complex clinical consultations naturally deviate from schedule.

For **`SerialNow.`** (published by S.goto Lab, developed under internal codename `phantom`), the mandate was to design an uncompromising, deterministic queue arbitration engine centered entirely around the receptionist's daily operational efficiency while providing patients with dignified, zero-friction queue transparency.

---

## The Execution

`SerialNow` is engineered as a zero-dependency, high-throughput coordination platform featuring an in-memory receptionist command cockpit coupled with a zero-PII read-only patient projection layer.

### 1. Receptionist-First Operational Primacy (Model B Calling)

The receptionist is the critical operational actor and the primary adoption gate. `SerialNow` treats the desk interface as an ergonomic mission-control cockpit designed for rapid tactile execution:
* **Sub-Second Core Operations:** Single-tap actions for `Complete & Next`, `Skip & Next`, `Recall`, `Complete only`, and `Skip only`.
* **5-Second Safe Undo & Tap Debounce:** Erroneous button clicks or accidental double-taps are debounced in software, with a 5-second non-destructive `Undo` buffer allowing immediate operational correction without database corruption.
* **Model B Physical Calling Guarantees:** A patient is **never** required to interact with an application, verify an SMS code, or check in digitally to be called. The absence of digital activity never disqualifies a patient; the doctor or receptionist physically calls the serial number in the waiting room.
* **Chamber Floor Adoption Metric:** The benchmark for success is receptionist advocacy—whether an operator can confidently state: *"আমাদের চেম্বারে SerialNow ব্যবহার করি"* without feeling burdened by data entry.

### 2. Deterministic Dual-Lane Batch Rotation (A/B/X Engine)

Outpatient clinics inherently balance two distinct clinical flows: new comprehensive diagnostic consultations and shorter follow-up report evaluations. `SerialNow` resolves this tension using a deterministic dual-lane batch engine:

| Lane | Clinical Domain | Queue Mechanics |
| :--- | :--- | :--- |
| **Lane A** | New / Primary Consultations | Initial in-depth diagnostic encounters requiring full consultation duration. |
| **Lane B** | Report Reviews & Returns | Follow-up patients returning with diagnostic laboratory / imaging reports. |
| **Lane X** | Emergency & Discretionary Triage | Elderly, acute, or doctor-interleaved cases served without corrupting A/B queue order. |

```
                       ┌─────────────────────────────────────┐
                       │   SerialNow Dual-Lane Queue Arbiter │
                       └──────────────────┬──────────────────┘
                                          │
                  ┌───────────────────────┼───────────────────────┐
                  ▼                       ▼                       ▼
        ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
        │ Lane A: New Visit│    │ Lane B: Returns  │    │ Lane X: Triage   │
        │ Batch Window: 5  │    │ Batch Window: 5  │    │ Interleaved Slot │
        └─────────┬────────┘    └─────────┬────────┘    └─────────┬────────┘
                  │                       │                       │
                  └───────────────────────┼───────────────────────┘
                                          ▼
                       ┌─────────────────────────────────────┐
                       │  Deterministic Rotation Transition  │
                       │  (5 Completed A ⇄ 5 Completed B)   │
                       └─────────────────────────────────────┘
```

The system executes a configurable batch cadence (default: **5 completed A visits alternating with 5 completed B visits**). When switching between lanes, partial progress is strictly preserved. Rejoining a skipped serial restores the patient to their original lane's tail (with manual front override capabilities), maintaining absolute mathematical transparency.

### 3. Zero-PII Patient Transparency Projection (`/preview/patient`)

Patients access an unauthenticated, read-only tracking view designed for low-end mobile devices and unstable cellular data:
* **Zero PII Leakage:** The projection pipeline executes a strict server/model whitelist. Patient names, telephone numbers, clinical notes, and triage reasons are completely dropped before reaching the patient view.
* **Uncalled Count Transparency:** Displays the exact count of uncalled bookings ahead within the patient's own lane and current batch progress, clearly distinguishing queue tickets from physical room attendance.
* **Refusal to Hallucinate Waiting Times:** The interface explicitly communicates that waiting time is nondeterministic (*"অপেক্ষার সময় অপরিবর্তনীয়/অজানা"*), refusing to invent misleading countdown timers.
* **Offline-Resilient Temporal Telemetry:** Offline, stale, and recovered states visibly display exact last-known synchronization timestamps (`Asia/Dhaka`), ensuring patients are never deceived by cached or interrupted data connections.

### 4. Mineral Teal Visual Demeanor & Low-Fatigue Contrast

Reflecting S.goto Lab's studio brand direction, the interface employs a **Mineral Teal** visual architecture:
* **Calm & Restrained Palette:** Built on deep mineral teal foundations (`#142D35`), raised teal paneling (`#24454D`), and warm ivory typography (`#F7F6F2`), anchored by a signature **mint trailing dot** (`#85D6B7`) in the `SerialNow.` wordmark.
* **Rejection of Clinical Clichés:** Eliminates jarring hospital-blue gradients, fake ECG heartlines, or decorative animations. The palette minimizes ocular fatigue during grueling 6-hour receptionist shifts and provides visual calm for distressed patients.

### 5. Accessibility & Quality-First Verification

The implementation follows a rigorous quality-first testing protocol:
* **75 Unit & Domain Tests (Vitest):** Proves mathematical transition invariants across mock reducers, batch rotations, undo cascades, and projection whitelists.
* **50 Full-Stack Browser Tests (Playwright):** Exercises complete patient and receptionist journeys against the production build on loopback `4173` across desktop, tablet, and mobile (360px, 768px, 1280px, 1440px) viewports with zero retries.
* **Automated Axe Accessibility Scans:** Zero detected accessibility violations (`axe-core 4.14.0`) across all queue states, 200% reflow scaling, high-contrast states, and system Noto Sans Bengali fallbacks.

---

## Engineering Takeaways

`SerialNow` demonstrates that technology in public healthcare settings succeeds through humility and operational alignment. By prioritizing the receptionist's physical workflow, eliminating digital barriers for sick patients, and implementing deterministic batch arbitration, the system proves that genuine clinical flow stability is achieved through strict domain constraints rather than surveillance or automated bureaucracy.
