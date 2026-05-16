# 🏆 Certifications System — Setup & Upload Guide

## Overview

The certifications system is fully structured and ready.
When you receive actual certificate PDFs, follow this guide to add them.

---

## 📁 File Structure

```
public/
├── certificates/
│   ├── infosys-ai-internship-2025.pdf
│   ├── eisystems-webdev-2025.pdf
│   ├── edunet-ai-data-analytics-2025.pdf
│   ├── edunet-ibm-cloud-2025.pdf
│   ├── aicte-cycle2-ev-2025.pdf
│   ├── microgenesis-dl-2025.pdf
│   ├── shadowfox-ds-2025.pdf
│   └── previews/
│       ├── infosys-ai-internship.jpg     ← thumbnail screenshot
│       ├── eisystems-webdev.jpg
│       ├── edunet-ai-analytics.jpg
│       ├── ibm-skills-build.jpg
│       ├── aicte-cycle2.jpg
│       ├── microgenesis-dl.jpg
│       └── shadowfox-ds.jpg
├── images/
│   └── logos/
│       ├── infosys.png
│       ├── eisystems.png
│       ├── edunet.png
│       ├── ibm.png
│       ├── aicte.png
│       ├── microgenesis.png
│       └── shadowfox.png
```

---

## ➕ How to Add a New Certificate

### Step 1 — Upload the file
```bash
cp your-certificate.pdf public/certificates/your-cert-name.pdf
```

### Step 2 — Generate preview thumbnail
```bash
# If you have ImageMagick installed:
convert -density 150 public/certificates/your-cert-name.pdf[0] \
  -quality 85 -resize 400x public/certificates/previews/your-cert.jpg
```

### Step 3 — Add to certifications.ts

Open `src/data/certifications.ts` and add a new entry:

```typescript
{
  id: 'cert-issuer-topic-year',              // unique ID
  title: 'Full Certificate Title Here',
  issuer: 'Issuing Organization Full Name',
  issuerShortName: 'Short Name',
  issuerLogo: '/images/logos/issuer.png',
  issuerColor: '#HEX_BRAND_COLOR',
  issueDate: 'Mon YYYY',                     // e.g. "Aug 2025"
  issueDateISO: 'YYYY-MM',                   // e.g. "2025-08"
  expiryDate: null,                          // or "Mon YYYY"
  doesExpire: false,
  credentialId: 'CREDENTIAL-ID-IF-VISIBLE',  // null if not visible
  credentialUrl: 'https://verify.issuer.com/credential-id',
  fileUrl: '/certificates/your-cert-name.pdf',
  previewUrl: '/certificates/previews/your-cert.jpg',
  skills: ['Skill 1', 'Skill 2', 'Skill 3'],
  category: 'ai_ml',   // ai_ml | cloud | web_development | data_science | others
  featured: true,       // show in highlights
  priority: 8,          // 1=highest, determines sort order
  badge: '🏆',
  description: 'One-liner recruiter-facing description of what you achieved.',
  linkedProject: {
    name: 'Project Name',
    description: 'What was built during this internship/certification.',
    techStack: ['Tech1', 'Tech2'],
    githubUrl: 'https://github.com/HUNTER-X0s/REPO',
    liveUrl: null,
    impact: 'What impact did it have? Metrics if possible.',
  },
  roleRelevance: ['ai_engineer', 'ml_engineer'],
}
```

### Step 4 — Update roleRelevance & certsByRoleForResume

In `certifications.ts`, add your cert ID to the relevant roles:
```typescript
export const certsByRoleForResume: Record<string, string[]> = {
  ai_engineer: ['cert-your-new-id', ...existingIds],
  // ...
}
```

---

## 🔍 Extracting Data from Certificate PDFs

When you upload certificates, use this checklist:

| Field | Where to Find |
|---|---|
| Title | Certificate header / main text |
| Issuer | Organization name + logo |
| Issue Date | "Issued on" / "Date" field |
| Expiry Date | "Valid until" / "Expires" field (or "No expiry") |
| Credential ID | Bottom of cert / QR code area |
| Credential URL | QR code link / "Verify at" text |

---

## 📊 Current Certifications (7 total)

| # | Certificate | Issuer | Date | Category | GitHub |
|---|---|---|---|---|---|
| 1 | AI Virtual Internship 2.0 | Infosys | Oct 2025 | AI/ML | CERTIFICATIONS |
| 2 | Web Development Internship | EISystems | Sep 2025 | Web Dev | CERTIFICATIONS |
| 3 | AI & Data Analytics Internship | Edunet Foundation | Aug 2025 | Data Science | CERTIFICATIONS |
| 4 | AI & Cloud Technologies (IBM Skills Build) | Edunet/IBM | Aug 2025 | Cloud | CERTIFICATIONS |
| 5 | AICTE Internship Cycle-2 (EV Prediction) | AICTE/Edunet | Aug 2025 | AI/ML | EV-VEHICLE repo |
| 6 | Deep Learning Internship | MicroGenesis TechSoft | Jul 2025 | AI/ML | CERTIFICATIONS |
| 7 | Data Science Internship | Shadow Fox | 2025 | Data Science | SHADOW-FOX repo |

> ⚠️ Fields marked with `// *inferred*` need updating with actual credential IDs from your certificates.

---

## 🎨 Issuer Logo Sources

Download official logos from:
- Infosys: https://www.infosys.com/media-resources.html
- IBM: https://www.ibm.com/brand/experience-guides/developer/b1db1ae501d522a1a4b49613fe07c9f1/01Introduction/1.3brand-elements.html
- AICTE: https://www.aicte-india.org
- Others: Use a 200x200px transparent PNG

---

## ⚡ Quick Commands

```bash
# Add all certificate PDFs at once
cp ~/Downloads/*.pdf public/certificates/

# List all certificates
ls -la public/certificates/

# Check frontend display
npm run dev
# → Open http://localhost:3000/#analytics
```
