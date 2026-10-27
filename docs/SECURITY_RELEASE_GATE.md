# KEBBEK security and release gate

## Verified source observation
In `index.html` around lines 2044–2050 and 2082–2083, the optional Hugging Face access token is stored in `localStorage` under `kebbek-zeri-hf` when the user enables the keep-token control. At line 2197 the token may be attached to an audio-download request.

## Risk
Persistent bearer tokens are readable by any JavaScript executing in the origin, including compromised third-party scripts. Attaching authorization to externally supplied download URLs also requires strict destination validation. No credential exposure or exploit has been reproduced.

## Proposed remediation
1. Default to session-only memory; never persist bearer tokens in localStorage.
2. Clear previously persisted tokens after explicit user-facing migration notice.
3. Allow authorization headers only for allowlisted trusted API origins; never forward tokens to arbitrary result URLs.
4. Prefer a secure server-side proxy with scoped, expiring credentials for commercial operation.
5. Add regression tests for token persistence, origin checks and logout.
6. Validate Safari user-gesture audio resume, media exports, and accessibility on real devices before release.

## Release gate
Do not merge or deploy until source changes have been tested in a browser and reviewed. GitHub Pages is a public static host, not a safe place for private service credentials.
