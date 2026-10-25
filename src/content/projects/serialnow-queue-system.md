---
title: "SerialNow: Outpatient Queue Arbitration System"
constraint: "Deterministic dual-lane batch rotation and sub-second receptionist ergonomics governing outpatient flow in single-doctor chambers with zero-PII patient transparency."
techStack: ["React 19", "TypeScript", "Vite", "Axe Core", "Playwright", "Vitest", "Cloudflare Workers (Planned)"]
date: 2026-10-25
demoVideoAvailable: false
---

> **System Endpoint:** [`https://serialnow.shagoto.me`](https://serialnow.shagoto.me) &bull; **Publisher:** S.goto Lab &bull; **Development Codename:** `phantom` &bull; **Visual Demeanor:** *Mineral Teal* &bull; **Brand Demeanor:** *"Clarity in the waiting."*

## The Constraint

In outpatient medical chambers throughout Bangladesh (Dhaka, Chittagong, and district divisional hubs), single-doctor practices operate under extreme physical queue pressure. A single physician typically evaluates 50 to 60 patients during an evening session across two divergent clinical modalities: new primary diagnostic consultations and follow-up reviews of diagnostic pathology or imaging reports.

Receptionists—frequently university students, medical apprentices, or junior clinic assistants of the consulting physician—serve as the sole operational buffer between an anxious, congested waiting room and the consultation door. They face continuous, high-stress interruptions (*"Koto serial cholche?"*, *"Ami kokhon jabo?"*). Under this strain, traditional healthcare IT solutions, mobile token platforms, and enterprise hospital ERPs suffer immediate operational rejection:

* **The Digital Compulsion Anti-Pattern:** Demanding that sick, exhausted, elderly, or tech-averse patients download mobile applications, create passworded user accounts, or verify SMS OTPs to secure a place in line introduces friction that halts clinic operations.
* **The Receptionist Cognitive Chokepoint:** Multi-step modal dialogues, redundant form validations, and complex dropdowns slow down physical intake. In a busy clinic, an interface that cannot outperform pen-and-paper in speed is discarded during peak hours.
* **The Fallacy of Hallucinated Wait Countdowns:** Clinical encounter times exhibit high natural variance; a follow-up report review may conclude in two minutes, while an acute diagnostic workup requires thirty. Systems that display linear countdown clocks (*"Your turn in 14 minutes"*) fabricate false promises and aggravate waiting-room disputes when schedules shift.

For **`SerialNow.`** (published by S.goto Lab under internal development codename `phantom`), the engineering mandate was to construct a deterministic, zero-friction queue arbitration engine designed around the receptionist's tactile speed, backed by an unauthenticated, zero-PII patient projection layer that provides truthful visibility without digital hurdles.

---

## The Execution

`SerialNow.` is architected as an edge-ready Single Page Application built on React 19 Strict Mode, strict TypeScript, and plain CSS, backed by an in-memory transactional reducer and designed for eventual persistence across Cloudflare Workers and Cloudflare D1.

### 1. Receptionist Operational Primacy (Model B Physical Calling)

The receptionist is the primary operator and the decisive adoption gate. `SerialNow.` treats the front-desk interface as an ergonomic mission-control console engineered for rapid keyboard and touch execution:

* **Sub-Second Core Operations:** Primary queue transitions execute through single-tap and hotkeyed actions: `Complete & Next`, `Skip & Next`, `Recall`, `Complete only`, and `Skip only`.
* **5-Second Compensating Undo & Tap Guard:** Accidental double-clicks and misclicks are trapped by a 450ms debounce guard. A non-destructive 5-second `Undo` buffer allows operators to reverse accidental state changes immediately. Reversals do not erase historical events; they append linked compensating records to the audit stream.
* **Model B Calling Semantics:** Patients are **never** required to interact with an application, verify an SMS token, or confirm arrival digitally. A booking is callable the moment it is entered. Digital silence never marks a patient absent or skips their place; the doctor or receptionist physically calls the ticket number in the waiting room.
* **Desk Adoption Benchmark:** Design decisions are judged by whether an operator can state: *"আমাদের চেম্বারে SerialNow ব্যবহার করি"* without feeling slowed down by data entry.

```typescript
// Append-Only Compensating Undo Invariant (No History Erasure)
export interface DemoEvent {
  id: string;
  timestamp: string;
  actor: string;
  command: DemoCommand;
  effect: DemoEffect;
  correctionOf?: string; // Linked prior event ID for non-destructive reversal
}

// Reversals append a compensating transition; historical event stream remains immutable
if (command.type === 'undo') {
  const targetEvent = state.events.find((e) => e.id === command.eventId);
  if (!targetEvent) return reject(state, 'Target event not found in audit stream');

  const compensatingEvent: DemoEvent = {
    id: generateEventId(),
    timestamp: currentSyntheticTime(),
    actor: 'receptionist',
    command,
    effect: computeInverseEffect(targetEvent.effect),
    correctionOf: targetEvent.id,
  };
  return applyCompensatingTransition(state, compensatingEvent);
}
```

### 2. Deterministic Dual-Lane Batch Rotation (A/B/X Engine)

Outpatient clinics inherently balance two distinct clinical workflows. `SerialNow.` arbitrates this tension using a deterministic state machine:

| Lane | Clinical Workflow | Operational Mechanism |
| :--- | :--- | :--- |
| **Lane A** | Primary Consultations | Comprehensive diagnostic evaluations requiring standard consultation windows. |
| **Lane B** | Report Reviews & Returns | Rapid evaluations of laboratory, pathology, or imaging reports ordered during earlier sessions. |
| **Lane X** | Interleaved Exceptions | Discretionary triage, acute cases, or physician-directed out-of-order visits handled without corrupting A/B rotation. |

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

The rotation engine enforces strict mathematical invariants:
* **Batch Quota Discipline:** The default rotation targets **5 completed A visits alternating with 5 completed B visits**. Crucially, a batch slot is consumed **only upon confirmed consultation completion**; calls, recalls, and skips do not advance the batch counter.
* **Interruption Preservation:** If the physician requests report reviews while Lane A is at `3/5`, the operator switches to Lane B. Lane B completes its `5/5` quota, and when Lane A is re-selected, it resumes with exactly 2 consultations remaining. Progress is preserved independently across lanes.
* **Lane X Interleaving:** Exceptional cases routed through Lane X temporarily pause the active batch without resetting either lane's progress counter. If an existing Lane A or B patient is served via Lane X, their original serial is preserved while their queue eligibility is retired, preventing duplicate consultations.
* **Late-Patient Rejoin Placement:** When a skipped patient returns, they are appended behind all currently uncalled, eligible bookings in their **original category** at the timestamp of the rejoin transaction, with an optional receptionist front override.

```typescript
// Deterministic Dual-Lane Batch Rotation & Boundary Arbiter
export const ordinaryEligible = (core: DemoCore, lane: OrdinaryLane): DemoVisit[] =>
  core.visits
    .filter(
      (visit) =>
        !sessionReadOnly(core.sessionStatus) &&
        visit.category === lane &&
        visit.status === 'uncalled' &&
        !visit.exception,
    )
    .sort((a, b) => a.order - b.order);

function settleBoundary(core: DemoCore, rotate = true): void {
  const manual = core.pendingOrdinary;
  if (manual) core.active = manual;
  core.pendingOrdinary = null;

  const other: OrdinaryLane = core.active === 'A' ? 'B' : 'A';

  // Batch quota consumed ONLY upon confirmed completion; progress is preserved independently
  if (
    !manual &&
    (((rotate) &&
      core.batches[core.active].completed >= core.batches[core.active].target) ||
      ordinaryEligible(core, core.active).length === 0) &&
    ordinaryEligible(core, other).length > 0
  ) {
    core.active = other;
  }
}
```

### 3. Zero-PII Patient Transparency Projection (`/preview/patient`)

Patients access an unauthenticated, read-only tracking view designed for low-end mobile devices and unstable cellular data:

* **Strict Whitelist Serialization:** The patient projection pipeline enforces a zero-PII whitelist. Patient names, telephone numbers, clinical notes, and exception reasons are dropped before the data leaves the projection layer.
* **Uncalled Count vs. Physical Presence:** The interface displays the exact count of uncalled bookings ahead within the patient's own category, explicitly informing the user that this metric reflects registered bookings rather than physical waiting-room attendance.
* **Anti-Hallucination Temporal Semantics:** The system explicitly displays that waiting time is nondeterministic (*"অপেক্ষার সময় অপরিবর্তনীয়/অজানা"*), refusing to generate speculative countdown clocks.
* **Stale & Offline Telemetry:** Offline and stale states visibly display the exact verified synchronization timestamp (`Asia/Dhaka`). If the network disconnects, the interface indicates data staleness rather than displaying a false empty queue.

```typescript
// Strict Whitelist Projection Pipeline — Zero PII Leakage
export function projectPatientSnapshot(input: PatientSnapshot): PatientSnapshot {
  const current = input.currentCall;
  return {
    serial: input.serial,
    category: input.category,
    visitStatus: input.visitStatus,
    sessionDate: input.sessionDate,
    scheduledStart: input.scheduledStart,
    actualStart: input.actualStart,
    doctorStatus: input.doctorStatus,
    // Lane X triage cases intentionally omit serial numbers and clinical reasons
    currentCall:
      current === null
        ? null
        : current.lane === 'X'
          ? { lane: 'X' }
          : { lane: current.lane, serial: current.serial },
    ownAhead: input.ownAhead, // Count of uncalled registered bookings ahead (not physical presence)
    ownBatch: {
      completed: input.ownBatch.completed,
      target: input.ownBatch.target,
    },
    rejoined: input.rejoined,
    lastUpdatedUtc: input.lastUpdatedUtc,
  };
}
```

### 4. Mineral Teal Demeanor & Low-Fatigue Contrast

Reflecting S.goto Lab's studio brand direction, the visual architecture employs a **Mineral Teal** theme:

* **Palette Foundations:** Built upon deep mineral teal (`#142D35`), raised surface cards (`#24454D`), warm ivory typography (`#F7F6F2`), and a signature **mint trailing dot** (`#85D6B7`) in the `SerialNow.` wordmark.
* **Elimination of Healthcare Tropes:** Eliminates hospital-blue gradients, decorative ECG lines, and glossy animations. The restrained contrast ratio minimizes ocular fatigue over 6-hour shifts and offers visual calm for distressed patients.

### 5. Quality-First Verification & Hardening

The codebase enforces strict quality gates:

* **75 Unit & Domain Tests (Vitest):** Validates deterministic state machine transitions, batch quota preservation across manual switches, undo chains, and projection whitelist drops.
* **50 Full-Stack Browser Tests (Playwright):** Exercises complete receptionist and patient journeys on the built production bundle on loopback `4173` across desktop, tablet, and mobile (360px, 768px, 1280px, 1440px) viewports with zero retries.
* **Automated Axe Accessibility Audits:** Zero detected violations (`axe-core 4.14.0`) across all queue states, 200% reflow scaling, high-contrast modes, and system Noto Sans Bengali typography.

---

## Hard Engineering Decisions & Trade-Offs

### 1. In-Memory Reducer with Compensating Event Log vs. Naive State Rollback
* **Context:** In a busy clinic, receptionists occasionally trigger `Complete & Next` or `Skip & Next` prematurely.
* **Decision:** Rather than relying on destructive rollback operations that erase database history, `SerialNow.` pairs compound operations into atomic units and implements undo via compensating events.
* **Trade-Off:** Requires maintaining an explicit dependency graph of recent actions. If dependent actions occur (e.g., another staff member registers a patient or advances the queue), blind rollback is blocked, and guided correction is offered instead. This guarantees historical audit integrity under future multi-operator concurrency.

### 2. Model B Physical Calling vs. Model A Digital Arrival Verification
* **Context:** Modern appointment platforms require patients to confirm arrival digitally via geolocation, QR scan, or SMS link.
* **Decision:** `SerialNow.` implements Model B calling, where all uncalled registered bookings remain call-eligible by default. Absence of digital response has zero operational consequence.
* **Trade-Off:** The system cannot guarantee that a called patient is physically seated in the waiting room. However, this mirrors real chamber operations: the receptionist physically announces the ticket number. If the patient is absent, the operator executes a single-tap `Skip`, preserving queue momentum without digital lockouts.

### 3. Whitelist Projection Pipeline vs. Dynamic Query Filtering
* **Context:** Patient tracking views must never expose identifying details of other patients or internal clinical annotations.
* **Decision:** The system separates the operational domain model from the public projection model through a compile-time and runtime whitelist pipeline.
* **Trade-Off:** Any new field intended for the patient view requires explicit whitelist registration. However, this architectural barrier eliminates accidental data exposure (such as internal triage notes or contact numbers) at the type system level.

---

## Engineering Takeaways & Invariants

`SerialNow.` demonstrates that software deployed in high-stress public environments succeeds through operational humility and deterministic constraints:

$$\text{Invariant 1 (Serial Stability)}: \quad S_{\text{orig}}(v) = \text{const} \quad \forall \text{ state transitions}$$
$$\text{Invariant 2 (Batch Quota)}: \quad \Delta Q_{\text{lane}} = 1 \iff \text{transition}(v) = \text{COMPLETED}$$
$$\text{Invariant 3 (Zero PII)}: \quad \text{fields}(\text{Projection}) \cap \{\text{Name}, \text{Phone}, \text{Notes}, \text{Reason}_X\} = \emptyset$$
$$\text{Invariant 4 (Non-Punitive Silence)}: \quad \text{ping}(p) = \text{false} \centernot\implies \text{status}(v) = \text{SKIPPED}$$

By prioritizing receptionist intake velocity, removing digital dependencies for sick patients, and enforcing mathematical batch arbitration, `SerialNow.` stabilizes outpatient flow without automated bureaucracy.
