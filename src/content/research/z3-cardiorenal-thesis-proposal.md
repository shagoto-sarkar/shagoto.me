---
title: "Formal Verification of Cardiorenal-Metabolic Guidelines"
abstract: "An undergraduate thesis proposal modeling and formally verifying polypharmacy clinical guidelines across cardiovascular, renal, and metabolic co-morbidities using first-order logic and Z3 SMT solver."
date: 2026-03-01
status: "proposal"
isProposal: true
supervisor: "Assistant Professor, Dept. of CSE, Daffodil International University"
tags: ["Thesis Proposal", "Formal Methods", "SMT Solvers", "KDIGO", "Cardiorenal-Metabolic"]
proofAvailable: true
githubUrl: "https://github.com/shagoto-sarkar/z3-cardiorenal-thesis-proposal"
---

> **Academic Notice:** This research initiative is an ongoing **Undergraduate Bachelor's Thesis Proposal** at Daffodil International University. It represents active theoretical formulation and formal modeling rather than a defended dissertation or clinical trial.

## Proposal Overview

Patients suffering from comorbid Type 2 Diabetes (T2D), Chronic Kidney Disease (CKD), and Heart Failure (HF) exist at the epicenter of therapeutic conflict. Clinical guidelines are historically authored in disease silos:
* **KDIGO** (Kidney Disease: Improving Global Outcomes) dictates renoprotective targets.
* **ADA** (American Diabetes Association) prescribes glycemic thresholds and SGLT2i indications.
* **ACC/AHA** (American College of Cardiology) specifies neurohormonal blockade.

When co-prescribed, pharmacodynamic interactions (e.g., ACE inhibitors combined with ARBs and mineralocorticoid receptor antagonists) create perilous risks of hyperkalemia and acute kidney injury. This thesis proposes a formal verification framework encoding heterogeneous guideline propositions into Satisfiability Modulo Theories (SMT).

---

## Research Questions & Formal Objectives

1. **Formal Encoding:** Can heterogeneous multi-society guidelines expressed in natural language be translated into decidable First-Order Logic (FOL) fragments without loss of clinical intent?
2. **Automated Conflict Detection:** Can an SMT solver (Microsoft Z3) deterministically uncover latent contradictions between concurrent guideline recommendations for multimorbid patient states in sub-second runtime?
3. **Counterexample Generation:** In cases of unsatisfiable regimens (`UNSAT`), can the solver automatically generate minimally disruptive alternative dosing parameters?

---

## Methodological Framework

The project constructs a formalization pipeline:
1. **Predicate Extraction:** Isolating biomarker boundary domains (eGFR, serum creatinine, potassium, ejection fraction, HbA1c).
2. **SMT Axiomatization:** Encoding guideline logic as conjunctions of implications over non-linear real and integer arithmetic.
3. **Solver Integration:** Verifying global satisfiability using the Z3 solver backend.

```python
# Formal Representation of Polypharmacy Conflict (Sample Theory)
from z3 import *

egfr = Real('egfr')
serum_k = Real('serum_k')
ras_inhibitor = Bool('ras_inhibitor')
mra = Bool('mra')

solver = Solver()

# Patient Context: Advanced CKD with Hyperkalemia
solver.add(egfr < 30.0)
solver.add(serum_k > 5.2)

# ACC Guideline: Indication for Heart Failure
solver.add(mra == True)

# KDIGO Safety Invariant: MRA + RASi contraindication when K+ > 5.0 or eGFR < 30
safety_invariant = Implies(
    And(mra, serum_k > 5.0),
    Not(ras_inhibitor)
)
solver.add(safety_invariant)

# Verifying if dual therapy is satisfiable
solver.add(ras_inhibitor == True)

# Returns UNSAT: Proves formal incompatibility of simultaneous therapy
assert solver.check() == unsat
```

---

## Academic Supervision & Milestones

* **Supervision:** Supervised under Assistant Professor, Department of Computer Science and Engineering, Daffodil International University (DIU).
* **Current Status:** Thesis Proposal Scaffolding & SMT Axiom Cataloging.
* **Scope & Research Disclaimer:** All formal models and constraint formulations in this proposal represent preliminary computational abstractions for logic evaluation. They are subject to ongoing academic review and do not constitute clinical prescribing recommendations or medical practice protocols.
* **Expected Deliverables:** Verified benchmark test suite, formalized SMT-LIB2 guideline library, and reproducible CLI analysis harness.
