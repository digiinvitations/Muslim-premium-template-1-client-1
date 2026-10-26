# Implementation Plan - Valima / Reception Wedding Website Updates

This plan outlines the updates required to refine the wedding website according to all recent user specifications.

## Proposed Changes

### 1. OpenGraph Image & Metadata Update (`index.html`)
- Update OpenGraph (`og:image`, `twitter:image`) and meta tags to use:
  `https://cdn.phototourl.com/member/2026-10-25-f55cd595-512c-4f00-8169-989325417c9b.png`
- Update title and description to feature `"Ansari' Family Reception"` and Valima.

### 2. Terminology & Content Updates ("Valima" & "Ansari' Family Reception")
- Replace all occurrences of "WALIMA" with "VALIMA" across components, data files, and UI text.
- Add `"Ansari' Family Reception"` prominently in the header/invitation header.

### 3. Bride & Family Details Update
- Remove any reference to `'Daughter of Syed Majid ali sahab'` across hero, invitation, and family details.
- Replace with `'Sr. Asst. GG college, Nizamabad'` for the bride's family subtitle / reference in both the hero section and family details section.

### 4. Hero Section & Typography Enhancement (`src/components/Hero.tsx`, `src/components/InvitationMessage.tsx`)
- Apply refined Islamic calligraphy & serif typography styling for the groom ("Mohammed Azeez uddin Ansari") and bride names in the hero section.
- Ensure responsive and elegant styling.

### 5. Multi-Hosting Data Pack Persistence (`src/services/db.ts` & `src/data.ts`)
- Ensure data defaults and Firestore/local storage fallback correctly default and persist to the `wedding_data_Muslim_Oct_Nov_Client_1` data pack across Vercel, Firebase Hosting, and local development.

## Verification Plan
- Run `compile_applet` and `lint_applet` to ensure zero compilation or type errors.
- Verify UI rendering of Valima, Ansari' Family Reception, Sr. Asst. GG college, Nizamabad, and hero typography.
