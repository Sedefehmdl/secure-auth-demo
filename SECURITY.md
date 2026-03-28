# Security Vulnerability Breakdown

This document maps each demonstrated vulnerability to its OWASP Top 10 category.

---

## 1. Username Enumeration
**OWASP:** A07 — Identification and Authentication Failures

**Vulnerable behavior:**
Error messages reveal whether a username exists:
- "No account found for this username" → attacker now knows valid usernames
- "Wrong password" → attacker knows the username is valid

**Secure fix:**
Always return a generic message regardless of which field is wrong:
- "Invalid username or password" — attacker learns nothing

---

## 2. No Rate Limiting
**OWASP:** A07 — Identification and Authentication Failures

**Vulnerable behavior:**
No limit on login attempts — an attacker can run automated brute force
attacks trying thousands of passwords with no consequence.

**Secure fix:**
Lock the account after 5 failed attempts. In production this would be
combined with CAPTCHA and IP-based throttling.

---

## 3. Plain Text Password Storage
**OWASP:** A02 — Cryptographic Failures

**Vulnerable behavior:**
Passwords stored as plain text in localStorage. If an attacker accesses
the storage (XSS, physical access, browser exploit), all passwords are
immediately exposed.

**Secure fix:**
Passwords should be hashed with bcrypt before storage. This app
simulates bcrypt output to demonstrate what a hashed password looks like.
In production: `bcrypt.hash(password, 10)`.

---

## 4. No Password Policy
**OWASP:** A07 — Identification and Authentication Failures

**Vulnerable behavior:**
Any string is accepted as a password — including single characters.
This makes brute force trivially easy.

**Secure fix:**
Enforce minimum length (8+ chars), uppercase, and numbers at registration.
Reject common passwords against a known-bad list in production.

---

## Author
Sadaf Ahmadli — MSc Cybersecurity student, ELTE Budapest  
TryHackMe: Top 8% globally · OWASP Top 10 badge
