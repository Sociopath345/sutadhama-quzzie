# Project Specification & Progress Document
**Project Name:** သုတဓမ္မ ဉာဏ်စမ်း (Suta Dhama Quizzes)  
**Corpus / Repository:** `Sociopath345/sutadhama-quzzie`  
**Target Environment:** Web (Vercel Serverless / SPA)  
**Primary Audience:** Monks, nuns, elders, and Buddhist learners in Myanmar  
**Document Target:** Google Antigravity & Pair-Programming Context  
**Last Updated:** October 2026  

---

## 1. Executive Summary

**သုတဓမ္မ ဉာဏ်စမ်း (Suta Dhama Quizzes)** is an accessible, serene, and mobile-optimized web application designed to help Buddhist examination candidates in Myanmar practice past exam questions with confidence. 

The application covers the complete official curriculum for:
- **ဒီပလိုမာတန်း (Diploma):** Level 1, Level 2, Level 3
- **ဝိဇ္ဇာဘွဲ့တန်း (B.A. Degree):** Part 1, Part 2, Part 3

The platform features over 3,700 questions categorized by course, level, and chapter, allowing students to practice specific chapters or complete syllabi with proportional question balancing, stress-free evaluation, and immediate post-exam review.

---

## 2. Technical Stack & Architecture

### 2.1 Frontend Architecture
- **Framework & Runtime:** Single-Page Application (SPA) driven by React 18 and Babel standalone for zero-build, rapid browser iteration.
- **Styling & Design System:** Tailwind CSS (utility-first CDN) with curated Buddhist aesthetic tokens:
  - **Cream / Parami Ivory:** `#FFFDF7`, `#FDFBF7`, `#FAF7F0`
  - **Ruby Maroon / Sangha Robe:** `#800000`, `#660000`, `#4A0000`
  - **Saffron / Amber Accents:** `#FF9933`, `#e68a00`
  - **Typography:** Myanmar Unicode font stack with prioritized fallbacks (`Pyidaungsu`, `Padauk`, `Myanmar3`, `system-ui`).
- **Icons:** Lucide Icons (`lucide-react` / SVG).
- **Dual-File Sync:**
  - `frontend/index.html`: Production runtime served by Vercel.
  - `frontend/App.jsx`: Component source code matching `index.html`.

### 2.2 Backend & Data Storage
- **Database & Auth:** Supabase (PostgreSQL 15 + Supabase Auth).
  - Project Endpoint: `https://vprxbhosrqvdduogdkih.supabase.co`
  - Tables:
    - `questions`: 3,700+ rows containing course, level, chapter, question text, 4 choices, correct answer, and explanations.
    - `feedbacks`: User feedback, bug reports, and suggestions submitted via the Contact Us form.
- **Data Ingestion Pipeline (Python 3):**
  - `backend/extractor.py` & generators: PDF syllabus text extraction to structured JSON.
  - `backend/upload_to_supabase.py`: Automated batch uploader (batch size 100).
  - `backend/update_supabase_chapters.sql`: Data normalization scripts for uniform numeric chapter references.

### 2.3 Hosting & CI/CD
- **Hosting Provider:** Vercel (`vercel.json` rewrite configuration pointing root traffic to `/frontend/index.html`).
- **Version Control:** GitHub `Sociopath345/sutadhama-quzzie` (`main` branch) with automated Vercel deployment on push.

---

## 3. Directory Structure

```text
sutadhama-quzzie/
├── frontend/
│   ├── App.jsx                 # Source React application component
│   ├── index.html              # Standalone production SPA (Tailwind + React 18)
│   └── Suta Logo.png           # App branding asset
├── backend/
│   ├── .env                    # Supabase credentials (gitignored)
│   ├── create_feedbacks_table.sql # DDL for Contact Us submissions
│   ├── update_supabase_chapters.sql # Chapter normalization SQL queries
│   ├── upload_to_supabase.py   # Bulk JSON to Supabase uploader
│   ├── extractor.py            # PDF question extractor
│   └── generate_ba*.py         # Curriculum generation scripts
├── data/
│   ├── About Us.txt            # Bilingual text source for About Us page
│   ├── pdf/                    # Original curriculum exam question books
│   └── json/                   # 37 curated JSON files (3,700+ questions)
├── index.html                  # Root launcher (redirects to /frontend/index.html)
├── vercel.json                 # Vercel URL rewrite rules
├── README.md                   # Public repository documentation
├── PROJECT_SPEC.md             # Antigravity project specification
└── .gitignore                  # Git ignore rules
```

---

## 4. Current Progress & Implemented Features

### ✅ 4.1 Navigation & Responsive Layout
- **Desktop & Mobile Navbar:** Fixed top navigation bar featuring the Suta Dhama logo, brand title, and section links:
  - ပင်မစာမျက်နှာ (Home)
  - လေ့ကျင့်ရန် (Practice / Courses)
  - ကျွန်ုပ်တို့အကြောင်း (About Us)
  - ဆက်သွယ်ရန် (Contact Us)
- **Mobile Drawer:** Symmetrical slide-down menu on mobile devices with smooth state management.
- **Authentication Header State:** Shows `ဝင်မည်` (Log In) and `အကောင့်ဖွင့်မည်` (Sign Up) when unauthenticated, and a personalized user profile avatar button with dropdown sign-out when logged in.

### ✅ 4.2 Authentication Flow (Supabase Auth)
- Full email/password registration and login modals.
- Real-time password confirmation match validation.
- Supabase Auth state listener (`onAuthStateChange` & `getSession`) with persistent sessions.

### ✅ 4.3 Course & Chapter Selection
- **Diploma Stream:** Level 1, Level 2, Level 3.
- **B.A. Stream:** Updated to Burmese curriculum conventions:
  - Header: **အပိုင်းရွေးချယ်ပါ** (Select Part)
  - Buttons: **အပိုင်း (၁)**, **အပိုင်း (၂)**, **အပိုင်း (၃)**
- **Dynamic Chapter Selector:** Queries distinct chapters from Supabase, featuring an "All Chapters" (အားလုံးရွေးမည်) quick-select and individual checkbox selection.

### ✅ 4.4 Quiz Engine & Mobile Symmetry
- **Proportional Question Fetching:** Balances question density based on chapter size, avoiding biased chapter selection.
- **Mobile-Symmetrical Navigation Bars (Top & Bottom):**
  - Implemented with `grid grid-cols-3` layout locking buttons to exact 33.33% widths:
    - Col 1: **နောက်သို့** (Previous)
    - Col 2: **ကျော်မည်** (Skip - locked dead center)
    - Col 3: **ရှေ့သို့** (Next) / **အဖြေလွှာတင်မည်** (Submit - with attention pulse)
  - Identical vertical padding (`py-3`), rounded pill corners (`rounded-2xl`), and text truncation to prevent wrapping on 360px–390px phone screens.
- **Question Matrix Drawer:** Quick-jump navigation grid displaying answered, skipped, and current questions.

### ✅ 4.5 Exam Results & Review
- Real-time score calculation with passing criteria badges.
- Comprehensive review mode showing user choice, correct option, and doctrinal explanations.

### ✅ 4.6 About Us & Contact Us
- **About Us:** Modern card layout with bilingual toggle (**မြန်မာ / English**), preserving ecclesiastical tone.
- **Contact Us:** Functional contact form storing messages directly in the Supabase `feedbacks` table with Row-Level Security (RLS) policies.

---

## 5. Active Challenges & Architectural Decisions

### 5.1 Myanmar ISP Supabase Connectivity (VPN Issues)
- **Problem:** Myanmar telecom operators (MPT, Atom, Ooredoo, MyTel) periodically throttle or block AWS/Cloudflare IP ranges used by `*.supabase.co`, causing `Failed to fetch` errors for users without a VPN.
- **Architectural Alternatives Considered:**
  1. **Option A: Full Firebase Migration:**
     - *Advantage:* Google endpoints (`*.googleapis.com`) are unblocked in Myanmar.
     - *Risk:* Firestore Free Tier limits to 50,000 document reads/day. With 3,000+ questions fetched in batches, 50 quiz sessions could exhaust the daily quota.
  2. **Option B: Hybrid Architecture (Recommended):**
     - **Static JSON on Vercel:** Move the 37 static JSON files into `frontend/data/json/`. Fetching static JSON from Vercel is free, lightning-fast, and 100% accessible in Myanmar without VPN.
     - **Firebase Auth & Feedback:** Use Firebase for user authentication and Contact Us submissions where write/read volumes are tiny.
  3. **Option C: Vercel Serverless / Cloudflare Reverse Proxy for Supabase:**
     - Proxy Supabase API requests through `/api/*` on Vercel or Cloudflare Workers. Myanmar users connect to Vercel/Cloudflare without VPN, while the server communicates with Supabase.

### 5.2 Codebase Synchronization Rule
- **Rule for AI Agents & Developers:**
  Whenever changes are made to UI, quiz logic, or styles in `frontend/index.html`, the corresponding code in `frontend/App.jsx` **must be updated simultaneously** to prevent divergence between development and production files.

---

## 6. Milestones & Next Steps

| Milestone | Description | Status |
| :--- | :--- | :--- |
| **M1: Core Exam Engine** | Question extraction, Supabase sync, proportional quiz generation | ✅ Complete |
| **M2: UI & Branding** | Theme modernization, Suta Dhama naming, About Us bilingual page | ✅ Complete |
| **M3: Mobile Optimization** | Symmetrical 3-column quiz navigation, mobile drawer | ✅ Complete |
| **M4: Vercel Beta Launch** | Continuous deployment on Vercel (`main` branch) | ✅ Complete |
| **M5: Myanmar VPN Fix** | Implement Hybrid Static JSON or Cloudflare/Firebase solution | ⏳ Next |
| **M6: Custom Domain Launch** | Connect custom domain once testing phase concludes | 📋 Planned |
| **M7: Offline / PWA Support** | LocalStorage caching for offline quiz practice | 📋 Planned |

---

## 7. Operational Guidelines for Antigravity

- **Always verify Git state:** Ensure changes are staged and committed with clean, descriptive commit messages.
- **Preserve Burmese Typography:** Ensure `Pyidaungsu` and `Padauk` font families remain defined with high readability for senior users.
- **Test Mobile Viewports First:** Always test button symmetry, drawer behaviour, and Burmese font line heights on 360px–420px viewports.
- **Secrets Management:** Keep Supabase service role keys and `.env` files out of Git.
