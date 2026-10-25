---
title: "Diu Shagoto IDE & Mini-Compiler"
constraint: "Engineering a fully functional educational compiler and code editor within standard web browser runtimes without external parsing libraries or bundler magic."
techStack: ["JavaScript", "HTML5", "CSS3", "Web APIs"]
date: 2025-02-20
collaborators: []
demoVideoAvailable: false
repoUrl: "https://github.com/shagoto-sarkar/diu-shagoto-ide"
---

## The Constraint

Browser-based programming environments typically rely on massive polyfills, external web assembly runtimes, or client-heavy npm modules (Babel, Acorn, Monaco).

The goal of **Diu Shagoto IDE** was to architect an in-browser educational compiler from scratch using pure, dependency-free JavaScript:
* **Zero External Parsers:** Custom lexical tokenizer and recursive descent parser written in vanilla JS.
* **Abstract Syntax Tree (AST) Inspection:** Visualizing node hierarchy in real-time as users write code.
* **Sandbox Execution:** Safe, isolated evaluation of imperative programming constructs without polluting the global `window` scope.

---

## The Execution

The compiler pipeline is split into three deterministic phases: Lexing, Parsing into an AST, and Bytecode/Interpreted Evaluation.

### Tokenizer & Parser Snippet

```javascript
// Lexical Tokenizer Implementation
function tokenize(input) {
  let current = 0;
  const tokens = [];

  while (current < input.length) {
    let char = input[current];

    if (/\s/.test(char)) {
      current++;
      continue;
    }

    if (/[0-9]/.test(char)) {
      let value = '';
      while (/[0-9]/.test(char) && current < input.length) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: 'NUMBER', value: Number(value) });
      continue;
    }

    if (/[a-zA-Z_]/.test(char)) {
      let value = '';
      while (/[a-zA-Z0-9_]/.test(char) && current < input.length) {
        value += char;
        char = input[++current];
      }
      const keywords = ['let', 'print', 'if', 'else', 'while'];
      tokens.push({
        type: keywords.includes(value) ? 'KEYWORD' : 'IDENTIFIER',
        value
      });
      continue;
    }

    if (['+', '-', '*', '/', '=', ';', '(', ')', '{', '}'].includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      current++;
      continue;
    }

    throw new SyntaxError(`Unexpected token at offset ${current}: '${char}'`);
  }

  return tokens;
}
```

### Educational Compiler Pipeline Demonstration

*Illustrative diagnostic log of the compiler execution stages:*

```text
$ diu-compiler run test_program.src
[PHASE 1: LEX]    Generated 42 tokens from source.
[PHASE 2: PARSE]  Constructed AST with 14 nodes. Root: ProgramBlock
[PHASE 3: TYPE]   Strict type-check passed. Zero undefined references.
[EXECUTION OUTPUT]
=========================================
Computed Fibonacci Sequence [N=10]: 55
State Memory: { counter: 10, accumulator: 55 }
=========================================
[STATUS] Process finished with exit code 0 (Execution time: 1.42ms).
```

---

## Architecture Summary

By building the lexical scanner and grammar tree from first principles, the project serves as an accessible pedagogical tool demonstrating that modern browser engines are potent execution environments when free from bloat.
