# Project Specification & Progress Document
**Project Name:** သုတဓမ္မ ဉာဏ်စမ်း (Suta Dhama Quizzes)  
**Corpus / Repository:** `Sociopath345/sutadhama-quzzie`  
**Target Environment:** Web (Vite + React 18 + React Router + Tailwind CSS / Vercel SPA)  
**Primary Audience:** Monks, nuns, elders, and Buddhist learners in Myanmar  
**Document Target:** Google Antigravity & Pair-Programming Context  
**Current Branch:** `version2`  
**Last Updated:** October 2026  

---

## 1. Executive Summary

**သုတဓမ္မ ဉာဏ်စမ်း (Suta Dhama Quizzes)** is an accessible, serene, and mobile-optimized web application designed to help Buddhist examination candidates in Myanmar practice past exam questions with confidence. 

The application covers the complete official curriculum for:
- **ဒီပလိုမာတန်း (Diploma):** Level 1, Level 2, Level 3
- **ဝိဇ္ဇာဘွဲ့တန်း (B.A. Degree):** Part 1, Part 2, Part 3

The platform features 3,685 questions categorized by course, level, and chapter, allowing students to practice specific chapters or complete syllabi with proportional question balancing, stress-free evaluation, and immediate post-exam review.

---

## 2. Version 2 Architecture & Major Upgrades

### 2.1 Frontend Architecture (Modeled after EC Head Election)
- **Modular Directory Structure:** Migrated from monolithic inline HTML to a modern Vite + React 18 + React Router component architecture (identical to `D:\EC Head Election`).
- **Directory-Based Routing & Mobile Back Button Support:**
  - `/` — Homepage (Hero, Dhamma library card, examination disclaimer)
  - `/about` — Bilingual About Us page with [မြန်မာ / English] toggle
  - `/contact` — Contact Us feedback form
  - `/practice` — Course selection (ဒီပလိုမာတန်း vs ဝိဇ္ဇာဘွဲ့တန်း)
  - `/practice/diploma` — Diploma level selection (Level 1, 2, 3)
  - `/practice/ba` — B.A. part selection (အပိုင်း ၁, ၂, ၃)
  - `/practice/:course/:level/chapters` — Dynamic chapter selector with Select All
  - `/practice/:course/:level/count` — Question count stepper (10 to 80 questions)
  - `/quiz` — Active Quiz engine with symmetrical 3-col navigation and matrix drawer
  - `/results` — Results scorecard with circular SVG progress ring and pass badges
  - `/review` — Comprehensive answer review with doctrinal explanations
- **Full History & Back Navigation:** Native browser back button and mobile (Android/iOS) swipe-back gestures work seamlessly without exiting the application.
- **Styling & Design System:** Tailwind CSS with curated Buddhist aesthetic tokens:
  - **Cream / Parami Ivory:** `#FFFDF7`, `#FDFBF7`, `#FAF9F6`
  - **Ruby Maroon / Sangha Robe:** `#800000`, `#660000`, `#4A0000`
  - **Saffron / Amber Accents:** `#FF9933`, `#e68a00`, `#FFCC00`
  - **Typography:** Myanmar Unicode font stack (`Pyidaungsu`, `Padauk`, `Noto Sans Myanmar`, `system-ui`).
- **Icons:** `lucide-react`.

### 2.2 Backend & Data Architecture (Supabase Dropped)
- **Zero-Supabase Migration (Myanmar VPN Solution):**
  - Supabase client and dependencies completely removed to eliminate Myanmar ISP blocks / VPN requirements.
  - Questions are stored and served as static JSON files in `public/data/questions/`:
    - `diploma_1.json` (440 questions)
    - `diploma_2.json` (440 questions)
    - `diploma_3.json` (670 questions)
    - `ba_1.json` (910 questions)
    - `ba_2.json` (685 questions)
    - `ba_3.json` (540 questions)
  - **Proportional Sampling Engine:** Runs client-side in `questionService.js`, delivering instant (0ms) question generation, balanced chapter distribution, and randomized choice orders with zero server latency.
- **Contact Us Delivery:**
  - Directly dispatches feedback to `sutadhamaquizzes@gmail.com` via FormSubmit API with a native `mailto:` fallback.
- **Authentication:**
  - Supabase Auth removed. Client-side local session management (`localStorage`) allows users to log in or register locally without VPN or external server dependencies.

### 2.3 Hosting & CI/CD
- **Hosting Provider:** Vercel SPA (`dist/` build directory).
- **Rewrite Rules (`vercel.json`):**
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```
- **Git Branch:** Currently on branch `version2` (unmerged to `main`).

---

## 3. Directory Structure

```text
sutadhama-quzzie/
├── public/
│   ├── Suta Logo.png            # App branding asset
│   └── data/
│       └── questions/           # 6 Consolidated JSON datasets (3,685 questions)
│           ├── diploma_1.json
│           ├── diploma_2.json
│           ├── diploma_3.json
│           ├── ba_1.json
│           ├── ba_2.json
│           └── ba_3.json
├── src/
│   ├── main.jsx                 # Vite application entry point
│   ├── App.jsx                  # Main route switch & layout
│   ├── index.css                # Tailwind directives & typography
│   ├── components/              # Modular UI components
│   │   ├── Navbar.jsx           # Desktop & mobile navigation header
│   │   ├── Footer.jsx           # Buddhist footer with disclaimer
│   │   ├── AuthModal.jsx        # Zero-Supabase local authentication modal
│   │   └── SubmitConfirmModal.jsx # Quiz submission confirmation dialog
│   ├── pages/                   # Directory-based route pages
│   │   ├── HomePage.jsx         # /
│   │   ├── AboutPage.jsx        # /about
│   │   ├── ContactPage.jsx      # /contact
│   │   ├── CoursesPage.jsx      # /practice
│   │   ├── LevelsPage.jsx       # /practice/diploma
│   │   ├── PartsPage.jsx        # /practice/ba
│   │   ├── ChaptersPage.jsx     # /practice/:course/:level/chapters
│   │   ├── QuestionCountPage.jsx # /practice/:course/:level/count
│   │   ├── QuizPage.jsx         # /quiz
│   │   ├── ResultsPage.jsx      # /results
│   │   └── ReviewPage.jsx       # /review
│   ├── context/
│   │   └── QuizContext.jsx      # Quiz state management
│   ├── services/
│   │   ├── questionService.js   # Question loading & proportional sampling
│   │   ├── feedbackService.js   # Email delivery to sutadhamaquizzes@gmail.com
│   │   └── authService.js       # Client-side session management
│   └── utils/
│       └── formatters.js        # Burmese digit conversion & chapter formatting
├── data/                        # Source syllabi & original JSON extractions
├── backend/                     # PDF extraction scripts (Python)
├── index.html                   # HTML entry point for Vite
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite build & preview configuration
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── vercel.json                  # Vercel URL rewrite rules
├── README.md                    # Public documentation
└── PROJECT_SPEC.md              # Antigravity project specification
```

---

## 4. Operational Guidelines

- **Preserve Burmese Typography:** Ensure `Pyidaungsu` and `Padauk` font families remain prioritized with high readability for senior users.
- **Mobile Viewports:** Symmetrical 3-column quiz navigation (`py-3`, `rounded-2xl`, 33.33% column locking) prevents button clipping on small 360px–390px screens.
- **Zero-VPN Accessibility:** Keep all question queries local or static via `/data/questions/` so Myanmar users face zero network hurdles.
- **Branch Management:** Retain changes on branch `version2` until explicit merge instruction.
