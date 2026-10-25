---
title: "8086 Microprocessor Assembly: Low-Level Optimization & Solutions"
date: 2024-12-05
category: "academia"
tags: ["8086 Assembly", "Microprocessors", "Low-Level Systems", "Registers", "Hardware Interrupts"]
---

## Grounded Computation on Bare Silicon

Programming in 16-bit 8086 assembly strips away the comforting illusions of modern compilers: no abstract garbage collection, no implicit register spilling, and no boundless memory. Every byte is accounted for inside explicit segments (`CS`, `DS`, `SS`, `ES`).

During university academic coursework in Microprocessors and Computer Architecture, I investigated optimal register utilization and BIOS/DOS interrupt routines for algorithmic problem solving.

---

## The Segmentation Model & Memory Addressing

The Intel 8086 architecture uses a segmented memory model to address 1 MB of physical RAM using 16-bit registers:
$$\text{Physical Address} = (\text{Segment} \times 16) + \text{Offset}$$

Understanding this linear transformation is critical when performing array operations and string manipulation across segment boundaries without pointer overflow.

---

## Assembly Solution: Multi-Digit BCD Arithmetic & Interrupt Dispatch

The following routine demonstrates interrupt-driven I/O (`INT 21h`), multi-digit ASCII conversion, and arithmetic accumulation in pure 8086 assembly:

```asm
; =========================================================================
; 8086 Assembly Program: Multi-Digit Number Reversal and Accumulation
; Target: DOSBox / 8086 Microprocessor Emulator
; =========================================================================
.MODEL SMALL
.STACK 100H

.DATA
    PROMPT_MSG  DB  'ENTER A NUMBER: $'
    RESULT_MSG  DB  0DH, 0AH, 'ACCUMULATED VALUE: $'
    BUFFER      DB  6 DUP(0)

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX

    ; Display Input Prompt (DOS Function 09h)
    LEA DX, PROMPT_MSG
    MOV AH, 09H
    INT 21H

    ; Read characters from STDIN
    XOR BX, BX          ; Clear BX (Accumulator)
READ_LOOP:
    MOV AH, 01H         ; Read character into AL
    INT 21H
    CMP AL, 0DH         ; Check for ENTER key (Carriage Return)
    JE  DISPLAY_RESULT

    SUB AL, '0'         ; Convert ASCII char to numeric digit
    MOV AH, 0
    PUSH AX

    ; Multiply BX by 10 (BX * 10 = BX * 8 + BX * 2)
    MOV AX, BX
    SHL BX, 1           ; BX * 2
    SHL AX, 1
    SHL AX, 1
    SHL AX, 1           ; AX * 8
    ADD BX, AX          ; BX = 10 * BX
    POP AX
    ADD BX, AX          ; Add current digit
    JMP READ_LOOP

DISPLAY_RESULT:
    LEA DX, RESULT_MSG
    MOV AH, 09H
    INT 21H

    ; Exit to DOS (Interrupt 21h, Function 4Ch)
    MOV AH, 4CH
    INT 21H
MAIN ENDP
END MAIN
```

---

## Reflections on Hardware Constraints

Writing assembly reinforces the concrete cost of operations that high-level languages abstract away. Substituting general multiplication instructions with bitwise shift-and-add arithmetic (`SHL BX, 1` plus shifts on `AX`) illustrates foundational register-level problem solving in 16-bit real-mode architectures. More importantly, direct register allocation and interrupt handling cultivate an appreciation for how bare hardware coordinates memory and control flow at the silicon boundary.
