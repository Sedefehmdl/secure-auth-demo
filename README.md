# SecureAuth Demo

An interactive React app demonstrating common authentication vulnerabilities and their fixes.

**Live demo:** [secure-auth-demo-two.vercel.app](https://secure-auth-demo-two.vercel.app/)

## What it demonstrates

Toggle between **Vulnerable** and **Secure** modes to see side-by-side how authentication can go wrong — and how to fix it.

| Vulnerability | OWASP Category | Demonstrated |
|---|---|---|
| Username enumeration via error messages | A07 | ✓ |
| No rate limiting — unlimited brute force | A07 | ✓ |
| Plain text password storage | A02 | ✓ |
| No password policy enforcement | A07 | ✓ |

## Built with

- React + Vite
- No backend — vulnerabilities demonstrated client-side with explanations

## Security note

This app is intentionally vulnerable in "Vulnerable mode" for educational purposes.
See [SECURITY.md](./SECURITY.md) for full vulnerability breakdown.
