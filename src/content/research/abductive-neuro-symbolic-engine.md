---
title: "Abductive Neuro-Symbolic Engine"
abstract: "A specialized clinical reasoning engine bridging fluid Large Language Model semantic extractions with rigid clinical requirements using Pydantic typing and Microsoft's Z3 SMT solver for deterministic satisfiability checking."
date: 2025-10-15
status: "ongoing"
isProposal: false
supervisor: "Assistant Professor, Dept. of CSE, Daffodil International University"
tags: ["Neuro-Symbolic AI", "Formal Verification", "Z3 SMT", "Pydantic", "Clinical Reasoning"]
proofAvailable: true
githubUrl: "https://github.com/shagoto-sarkar/abductive-neuro-symbolic-engine"
---

## Executive Abstract

Modern Large Language Models (LLMs) excel at probabilistic syntactic parsing and fuzzy entity extraction from uncurated clinical narratives, yet fail systematically when tasked with rigid, safety-critical deduction. Hallucinations and subtle logical inconsistencies in medical polypharmacy regimens present unacceptable patient risks. 

The **Abductive Neuro-Symbolic Engine** resolves this fundamental tension by establishing a two-tier hybrid architecture:
1. **Probabilistic Perception Layer:** An LLM agent parses natural language electronic health records (EHR) into strongly-typed Pydantic assertions.
2. **Deterministic Verification Layer:** Assertions are compiled into First-Order Logic (FOL) formulas evaluated by **Microsoft Z3 SMT Solver** to mathematically verify that proposed interventions satisfy all axiomatic clinical guidelines without contradiction.

---

## Methodology & Architecture

The system decouples fuzzy semantic comprehension from mathematical theorem proving. When a clinician enters an unstructured patient profile, the pipeline progresses deterministically:

```
[Unstructured Narrative] ──> [LLM Semantic Extractor] ──> [Pydantic Structural Model] ──> [Z3 SMT Solver] ──> [SAT / UNSAT Proof]
```

### 1. Semantic Extraction & Strict Typing
The model constrains LLM output into typed ASTs validated via Pydantic. Any schema failure triggers an immediate rejection before reaching the constraint engine:

```python
from pydantic import BaseModel, Field
from typing import List, Optional

class PatientBiomarkers(BaseModel):
    patient_id: str
    egfr_ml_min: float = Field(..., ge=0.0, le=200.0)
    serum_potassium_meq_l: float = Field(..., ge=1.0, le=10.0)
    systolic_bp_mmhg: int = Field(..., ge=50, le=260)
    active_prescriptions: List[str]
    diagnosed_comorbidities: List[str]
```

### 2. SMT Theory Generation & Solvability
The validated biomarkers and intended clinical interventions are converted into first-order clauses. The Z3 SMT engine evaluates satisfiability against axiomatic medical contraindications:

```python
from z3 import Solver, Real, Bool, And, Implies, sat, unsat

def verify_clinical_safety(egfr_val: float, potassium_val: float, prescribing_spironolactone: bool):
    s = Solver()
    
    # Mathematical variables
    egfr = Real('egfr')
    k_serum = Real('k_serum')
    rx_spironolactone = Bool('rx_spironolactone')
    hyperkalemia_risk = Bool('hyperkalemia_risk')
    
    # Ground truth clinical state
    s.add(egfr == egfr_val)
    s.add(k_serum == potassium_val)
    s.add(rx_spironolactone == prescribing_spironolactone)
    
    # Axiom: KDIGO / ACC Guideline for Aldosterone Antagonists
    # Contraindicated if eGFR < 30 mL/min OR Serum Potassium > 5.0 mEq/L
    contraindication_rule = Implies(
        rx_spironolactone,
        And(egfr >= 30.0, k_serum <= 5.0)
    )
    s.add(contraindication_rule)
    
    result = s.check()
    if result == sat:
        return {"status": "VERIFIED", "model": s.model()}
    else:
        return {"status": "UNSAT_CONTRADICTION", "reason": "Severe Hyperkalemia / Renal Risk"}
```

---

## Formal Evaluation, Outcomes & Limitations

By formulating safety boundaries as automated constraint satisfiability rather than next-token probability, the engine isolates semantic extraction from formal logic evaluation:

- **Formal Constraint Satisfaction (`sat`):** When parameters satisfy all encoded rules, Z3 produces a satisfying assignment (`sat`). This indicates consistency with the formal axioms, not clinical efficacy or comprehensive patient safety.
- **Deterministic Conflict Isolation (`unsat`):** When patient biomarkers and proposed prescriptions contradict formal guidelines, Z3 yields `unsat`. In conjunction with named assertions and unsat-core extraction, the engine isolates the specific conflicting guideline rule and biomarker premise.
- **Undecidability & Solver Bounds (`unknown` / Timeout):** Where complex quantifier-free or non-linear theories exceed solver bounds, the engine flags an unverified (`unknown`) state, rejecting automatic approval and requiring manual physician review.
- **Extraction Dependency Limitation:** The formal solver cannot correct subtle extraction errors made by the upstream LLM. If the language model hallucinates an inaccurate biomarker value (e.g., misreading 5.4 mEq/L as 4.5 mEq/L), the solver operates on false premises (garbage in, formal contradiction out). Pydantic boundary checks reduce out-of-range values but cannot guarantee clinical semantic fidelity without physician verification.
