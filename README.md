<div align="center">

  <img src="Suta Logo.png" alt="သုတဓမ္မ ဉာဏ်စမ်း Logo" width="130" style="border-radius: 24px;" />

  # သုတဓမ္မ ဉာဏ်စမ်း
  ### Suta Dhama Quizzes (Version 2.0)

  **ဓမ္မမိတ်ဆွေများ အလွယ်တကူ လေ့ကျင့်နိုင်သော ဗုဒ္ဓဓမ္မ ဉာဏ်စမ်းအစီအစဉ်**  
  *A peaceful, accessible, and mindful quiz companion for Buddhist learners*

  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
  [![Zero--VPN](https://img.shields.io/badge/Zero--VPN-Accessible-success.svg)](#)

</div>

---

### မင်္ဂလာပါရှင် / ခင်ဗျာ 🙏
**သုတဓမ္မ ဉာဏ်စမ်း (Suta Dhama Quizzes Version 2.0)** မှ နွေးထွေးစွာ ကြိုဆိုပါ၏။

ဤစနစ်လေးသည် သာသနာတော်ဆိုင်ရာ သုတဓမ္မစာမေးပွဲ ဖြေဆိုကြမည့် သံဃာတော်များ၊ သီလရှင်များ၊ ဓမ္မမိတ်ဆွေများနှင့် လူကြီးမိဘများ စာမေးပွဲမတိုင်မီ စိတ်အေးချမ်းသာစွာဖြင့် မေးခွန်းဟောင်းများကို အချိန်မရွေး၊ နေရာမရွေး လေ့ကျင့်ဖြေဆိုနိုင်ရန် ရည်ရွယ်၍ စေတနာသဒ္ဓါတရားဖြင့် ဖန်တီးထားခြင်း ဖြစ်ပါသည်။

---

### 🌟 Version 2.0 အဓိက ထူးခြားချက်များ (Key Features)

- 🌐 **VPN မလိုဘဲ တိုက်ရိုက် လေ့ကျင့်နိုင်ခြင်း (Zero-VPN & Zero-Supabase)**
  - မြန်မာနိုင်ငံတွင်း ISP ကန့်သတ်ချက်များကြောင့် VPN ဖွင့်ရသည့် အခက်အခဲကို ဖြေရှင်းရန်အတွက် Supabase အား အပြီးတိုင် ဖယ်ရှားပြီး မေးခွန်းပေါင်း **၃,၆၈၅** ခုလုံးကို Static JSON အဖြစ် တိုက်ရိုက် ပြောင်းလဲ ထည့်သွင်းထားပါသည်။
  - မည်သည့် VPN မှ အသုံးပြုစရာမလိုဘဲ အချိန်မရွေး မြန်ဆန်ပေါ့ပါးစွာ ဖြေဆိုနိုင်ပါသည်။

- 📱 **Directory-Based Routing & Back Button အပြည့်အဝ ထောက်ပံ့ခြင်း**
  - React Router ဖြင့် စာမျက်နှာများကို သီးသန့် URL လမ်းကြောင်းများအဖြစ် ခွဲထုတ်တည်ဆောက်ထားသောကြောင့် ဖုန်းနှင့် Browser များ၏ Go Back / Swipe Back ခလုတ်များကို သဘာဝအတိုင်း အဆင်ပြေချောမွေ့စွာ အသုံးပြုနိုင်ပါသည်။
  - လမ်းကြောင်းများ: `/`, `/practice`, `/practice/diploma`, `/practice/ba`, `/practice/:course/:level/chapters`, `/practice/:course/:level/count`, `/quiz`, `/results`, `/review`, `/about`, `/contact`

- ⚖️ **အချိုးကျ မေးခွန်းရွေးထုတ်မှုစနစ် (Proportional Balancing Engine)**
  - သင်ရိုးပါ အခန်းများ၏ မေးခွန်းအရေအတွက်အပေါ် မူတည်ပြီး အချိုးကျ အညီအမျှ ကျပန်း ရွေးထုတ်ပေးသဖြင့် သင်ခန်းစာအားလုံး ခြုံငုံလေ့ကျင့်ခွင့် ရရှိစေပြီး စာမေးပွဲတစ်ခုအတွင်း မေးခွန်းထပ်ခြင်း လုံးဝ (၀%) မရှိစေရန် အာမခံပါသည်။

- 🕊️ **မျက်စိအေးချမ်းစေသော သင်္ကန်းရောင် ဒီဇိုင်း**
  - သာသနာတော်ဆိုင်ရာ အထိမ်းအမှတ် သင်္ကန်းရောင်၊ ပတ္တမြားညိုရောင် (Ruby Maroon) နှင့် ရွှေဝါရောင် (Saffron Amber) တို့ဖြင့် မျက်စိမညောင်းစေရန် အထူးဖန်တီးထားပါသည်။
  - လူကြီးမိဘများ ဖတ်ရှုရ လွယ်ကူစေရန် စာလုံးအရွယ်အစားကြီးမားပြီး ရှင်းလင်းသော မြန်မာဖောင့် (Pyidaungsu & Padauk) ကို အသုံးပြုထားပါသည်။

- 📬 **တိုက်ရိုက် ဆက်သွယ်အကြံပြုနိုင်ခြင်း (Contact Us)**
  - အက်ပ်အတွင်းမှ FormSubmit API ဖြင့် `sutadhamaquizzes@gmail.com` သို့ တိုက်ရိုက် အကြံပြုချက် ပေးပို့နိုင်ပြီး Email Client ဖြင့် ပေးပို့လိုသူများအတွက် mailto fallback လည်း ပါဝင်ပါသည်။

- 🔐 **EmailJS Interactive OTP စနစ်ဖြင့် အကောင့်အတည်ပြုခြင်း**
  - ပြင်ပ Database အကောင့်စနစ်များ မလိုဘဲ အသုံးပြုသူ၏ အီးမေးလ်သို့ ဂဏန်း ၆ လုံးပါ OTP ကုဒ် ပေးပို့ကာ အပြန်အလှန် စစ်ဆေးအတည်ပြုနိုင်ပါသည်။

---

### 💻 စတင် အသုံးပြုခြင်းနှင့် စမ်းသပ်မောင်းနှင်နည်း (Getting Started)

#### လိုအပ်ချက်များ (Prerequisites)
- [Node.js](https://nodejs.org/) (Version 18 သို့မဟုတ် 20 အထက်)
- npm သို့မဟုတ် yarn

#### ၁။ Repository ရယူခြင်း (Clone)
```bash
git clone https://github.com/Sociopath345/sutadhama-quzzie.git
cd sutadhama-quzzie
```

#### ၂။ လိုအပ်သော Packages များ ထည့်သွင်းခြင်း (Install Dependencies)
```bash
npm install
```

#### ၃။ Environment Variables သတ်မှတ်ခြင်း (Optional for EmailJS)
`.env.example` ကို `.env` အဖြစ် ကူးယူပြီး မိမိ၏ EmailJS Credentials များကို ဖြည့်သွင်းနိုင်ပါသည်:
```bash
cp .env.example .env
```
```env
VITE_EMAILJS_SERVICE_ID=service_ntad4ns
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```
*(EmailJS မထည့်သွင်းထားပါကလည်း စာမေးပွဲ လေ့ကျင့်ခြင်းနှင့် အမှတ်တွက်ချက်ခြင်း အပိုင်းများကို အပြည့်အဝ အသုံးပြုနိုင်ပါသည်)*

#### ၄။ Development Server ဖွင့်လှစ်ခြင်း (Run Locally)
```bash
npm run dev
```
Browser တွင် `http://localhost:3000` ဖြင့် ဝင်ရောက် အသုံးပြုနိုင်ပါသည်။

#### ၅။ Production Build တည်ဆောက်ခြင်း (Build)
```bash
npm run build
npm run preview
```

---

### 📁 ပရောဂျက် တည်ဆောက်ပုံ (Project Structure)

```text
sutadhama-quzzie/
├── public/
│   ├── Suta Logo.png            # App Logo Asset
│   └── data/
│       └── questions/           # မေးခွန်းပေါင်း ၃,၆၈၅ ခုပါ Static JSON ဖိုင်များ
│           ├── diploma_1.json   # ဒီပလိုမာ အဆင့် ၁ (၄၄၀ ပုဒ်)
│           ├── diploma_2.json   # ဒီပလိုမာ အဆင့် ၂ (၄၄၀ ပုဒ်)
│           ├── diploma_3.json   # ဒီပလိုမာ အဆင့် ၃ (၆၇၀ ပုဒ်)
│           ├── ba_1.json        # ဝိဇ္ဇာဘွဲ့ အပိုင်း ၁ (၉၁၀ ပုဒ်)
│           ├── ba_2.json        # ဝိဇ္ဇာဘွဲ့ အပိုင်း ၂ (၆၈၅ ပုဒ်)
│           └── ba_3.json        # ဝိဇ္ဇာဘွဲ့ အပိုင်း ၃ (၅၄၀ ပုဒ်)
├── src/
│   ├── main.jsx                 # Vite Entry Point
│   ├── App.jsx                  # React Router Route Switch & Shell
│   ├── index.css                # Tailwind Directives & Font Configuration
│   ├── components/              # Modular UI Components
│   │   ├── Navbar.jsx           # Header & Mobile Nav Drawer
│   │   ├── Footer.jsx           # Dhamma Blessing & Disclaimer Footer
│   │   ├── AuthModal.jsx        # EmailJS OTP Account Modal
│   │   └── SubmitConfirmModal.jsx # Quiz Submit Modal
│   ├── pages/                   # Directory Route Pages
│   │   ├── HomePage.jsx         # / (ပင်မစာမျက်နှာ)
│   │   ├── AboutPage.jsx        # /about (ကျွန်ုပ်တို့အကြောင်း မြန်မာ/English)
│   │   ├── ContactPage.jsx      # /contact (ဆက်သွယ်ရန် ဖောင်)
│   │   ├── CoursesPage.jsx      # /practice (သင်တန်း ရွေးချယ်မှု)
│   │   ├── LevelsPage.jsx       # /practice/diploma (ဒီပလိုမာ အဆင့်များ)
│   │   ├── PartsPage.jsx        # /practice/ba (ဝိဇ္ဇာဘွဲ့ အပိုင်းများ)
│   │   ├── ChaptersPage.jsx     # /practice/:course/:level/chapters (အခန်းရွေးချယ်မှု)
│   │   ├── QuestionCountPage.jsx # /practice/:course/:level/count (မေးခွန်းအရေအတွက်)
│   │   ├── QuizPage.jsx         # /quiz (စာမေးပွဲ ဖြေဆိုရာ စာမျက်နှာ)
│   │   ├── ResultsPage.jsx      # /results (ရလဒ်နှင့် အောင်/ကျ မှတ်တမ်း)
│   │   └── ReviewPage.jsx       # /review (အဖြေမှန် ဆန်းစစ်ချက်)
│   ├── context/
│   │   └── QuizContext.jsx      # Quiz State Provider
│   ├── services/
│   │   ├── questionService.js   # Question Loader & Proportional Sampler
│   │   ├── feedbackService.js   # FormSubmit & Mailto Dispatcher
│   │   ├── emailService.js      # EmailJS OTP Email Dispatcher
│   │   └── authService.js       # Local Storage Session Manager
│   └── utils/
│       └── formatters.js        # မြန်မာဂဏန်း ပြောင်းလဲခြင်းနှင့် Formatters
├── index.html                   # HTML Template with Google Fonts
├── package.json                 # Dependencies & Build Scripts
├── vite.config.js               # Vite Configuration (Port 3000)
├── tailwind.config.js           # Tailwind CSS Configuration
├── postcss.config.js            # PostCSS Configuration
├── vercel.json                  # Vercel SPA URL Rewrites
└── README.md                    # Project Documentation
```

---

### 🚀 Vercel Deployment

ဤစနစ်ကို Vercel ပေါ်တွင် တင်ထားပြီးဖြစ်ပါက အောက်ပါ Settings များကို သတ်မှတ်ပေးရန် လိုအပ်ပါသည်:
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `./`
- **Environment Variables**: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

---

### 🤝 ဆက်သွယ်ရန်နှင့် မူပိုင်ခွင့်

- **GitHub Repository**: [https://github.com/Sociopath345/sutadhama-quzzie](https://github.com/Sociopath345/sutadhama-quzzie)
- **Developer**: [Sociopath345](https://github.com/Sociopath345)
- **Email**: [sutadhamaquizzes@gmail.com](mailto:sutadhamaquizzes@gmail.com)

---

### ⚖️ ရှင်းလင်းချက် (Disclaimer)
ဤဝက်ဘ်ဆိုက်သည် သက်ဆိုင်ရာ သုတဓမ္မစာမေးပွဲ ကျင်းပရေးကော်မတီ (သို့မဟုတ်) တရားဝင်အဖွဲ့အစည်းများနှင့် တိုက်ရိုက်ပတ်သက်မှု၊ ထောက်ခံမှု သို့မဟုတ် အသိအမှတ်ပြုမှု ရယူထားခြင်း မရှိပါ။ ဤဝက်ဘ်ဆိုက်ပါ အချက်အလက်များနှင့် မေးခွန်းများအားလုံးသည် သုတဓမ္မ ဒီပလိုမာတန်းနှင့် ဝိဇ္ဇာဘွဲ့တန်း ဖြေဆိုမည့်သူများ စာမေးပွဲအတွက် ကြိုတင်လေ့ကျင့်နိုင်ရန်နှင့် ဓမ္မဗဟုသုတ မျှဝေရန် ရည်ရွယ်ချက်သက်သက်ဖြင့်သာ ဖန်တီးထားခြင်းဖြစ်ပြီး တရားဝင်စာမေးပွဲ ကျင်းပခြင်း ကိစ္စရပ်များနှင့် လုံးဝသက်ဆိုင်ခြင်း မရှိပါ။

---

> *"ဓမ္မဒါနံ သဗ္ဗဒါနံ ဇိနာတိ"*  
> အလုံးစုံသော အလှူတို့တွင် တရားအလှူသည် အမြတ်ဆုံး ဖြစ်၏။  
> 
> ဤကောင်းမှု ကုသိုလ်အစုစုကြောင့် ဓမ္မမိတ်ဆွေများအားလုံး ကိုယ်စိတ်နှစ်ဖြာ ကျန်းမာချမ်းသာကြပြီး တရားအသိ၊ ဉာဏ်အလင်းများ တိုးပွားကြပါစေသတည်း။ 🙏
