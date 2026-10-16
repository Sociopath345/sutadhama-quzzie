// Helper function to convert English digits to Burmese digits
export const toBurmeseDigits = (numStr) => {
  const burmeseDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
  return String(numStr).replace(/[0-9]/g, (d) => burmeseDigits[parseInt(d, 10)]);
};

// Helper function to parse Burmese / English digit string to number
export const parseLevelNumber = (str) => {
  if (!str) return 1;
  const burmeseToArabic = { '၁': '1', '၂': '2', '၃': '3', '၄': '4', '၅': '5' };
  const normalized = String(str).replace(/[၁၂၃၄၅]/g, (m) => burmeseToArabic[m] || m);
  const num = parseInt(normalized.replace(/\D/g, ''), 10);
  return isNaN(num) ? 1 : num;
};

// Helper function to format chapter label naturally
export const formatChapterLabel = (chapterStr, courseType) => {
  if (!chapterStr) return '';
  const str = String(chapterStr).trim();
  if (str.includes('အခန်း') || str.includes('အပိုင်း')) {
    return str;
  }
  const prefix = courseType === 'ba' || courseType === 'BA' ? 'အပိုင်း' : 'အခန်း';
  if (str.includes('-')) {
    const parts = str.split('-');
    return `${prefix} ${toBurmeseDigits(parts[0])} မှ ${toBurmeseDigits(parts[1])}`;
  }
  return `${prefix} ${toBurmeseDigits(str)}`;
};

// Helper function to sort chapter strings numerically
export const sortChapters = (a, b) => {
  const numA = parseInt(String(a).match(/\d+/)?.[0] || '999', 10);
  const numB = parseInt(String(b).match(/\d+/)?.[0] || '999', 10);
  if (numA !== numB) return numA - numB;
  return String(a).localeCompare(String(b));
};

// Bilingual Content for About Us Page
export const aboutContent = {
  my: {
    heroTag: 'ကျွန်ုပ်တို့အကြောင်း',
    heroTitle: 'သုတဓမ္မ ဉာဏ်စမ်း',
    heroSubtitle: 'သာသနာတော် အဓွန့်ရှည်တည်တံ့ခိုင်မြဲစေရန် ရည်ရွယ်၍ ပညာဘူမိတက္ကသိုလ်မှ သုတဓမ္မစာမေးပွဲများကို နှစ်စဉ် ကျင်းပပြုလုပ်လျက်ရှိပါသည်။ ဤ \'သုတဓမ္မဉာဏ်စမ်း\' ဝက်ဘ်ဆိုက်သည် မြန်မာတစ်နိုင်ငံလုံးရှိ သုတဓမ္မ ဒီပလိုမာတန်းနှင့် ဝိဇ္ဇာဘွဲ့တန်း တက်ရောက်သင်ကြားနေကြသော ဓမ္မမိတ်ဆွေများအနေဖြင့် စာမေးပွဲမတိုင်မီ ကြိုတင်လေ့ကျင့်နိုင်ရန် ရည်ရွယ်ဖန်တီးထားသော အခမဲ့ လေ့ကျင့်ရေးပလက်ဖောင်းတစ်ခု ဖြစ်ပါသည်။',
    objectiveTitle: 'ကျွန်ုပ်တို့၏ ရည်ရွယ်ချက်',
    objectiveDesc: 'အသက်အရွယ်မရွေး ဓမ္မမိတ်ဆွေများအနေဖြင့် နည်းပညာအခက်အခဲမရှိဘဲ မိမိတို့၏ လက်ကိုင်ဖုန်း (သို့မဟုတ်) ကွန်ပျူတာများမှတစ်ဆင့် ဓမ္မစာပေများကို လွယ်ကူအဆင်ပြေစွာ လေ့လာမှတ်သားနိုင်စေရန် ရည်ရွယ်ပါသည်။ အကောင့်ဖွင့်ရန် မလိုအပ်ဘဲ အချိန်မရွေး ဝင်ရောက်လေ့ကျင့်နိုင်ရန် အထူးစီစဉ်ပေးထားပါသည်။',
    featuresTitle: 'ဤဝက်ဘ်ဆိုက်၏ ထူးခြားချက်များ',
    features: [
      {
        title: 'လုံးဝ အခမဲ့ဖြစ်ခြင်း',
        desc: 'မည်သည့် အခကြေးငွေမျှ ပေးသွင်းရန် မလိုအပ်သော ကုသိုလ်ဖြစ် (Zero-profit) ပရောဂျက် သက်သက်သာ ဖြစ်ပါသည်။'
      },
      {
        title: 'အသုံးပြုရ လွယ်ကူရှင်းလင်းခြင်း',
        desc: 'ဖတ်ရှုရ ရှင်းလင်းသော မြန်မာစာလုံးအလှများ၊ ကြီးမားသော စာလုံးအရွယ်အစားများနှင့် ရှင်းလင်းသော အရောင်အသွေးများကို အသုံးပြုထားသဖြင့် သက်ကြီးရွယ်အိုများအတွက်ပါ အထူးသင့်လျော်ပါသည်။'
      },
      {
        title: 'စနစ်ကျသော လေ့ကျင့်မှု',
        desc: 'ပြဌာန်းစာအုပ်ပါ အခန်းများအလိုက် မေးခွန်းများကို အချိုးကျ ထည့်သွင်းပေးထားပြီး မိမိလေ့ကျင့်လိုသော အခန်းများကို စိတ်ကြိုက်ရွေးချယ် ဖြေဆိုနိုင်ပါသည်။'
      },
      {
        title: 'အဖြေမှန် ရှင်းလင်းချက်များ',
        desc: 'ဖြေဆိုပြီးပါက မိမိ၏ ရမှတ်ကို ရာခိုင်နှုန်းဖြင့် ကြည့်ရှုနိုင်ပြီး အဖြေမှန်များနှင့်တကွ ရှင်းလင်းချက်များကို ပြန်လည်တိုက်ဆိုင် စစ်ဆေးနိုင်ပါသည်။'
      }
    ],
    goodwillTitle: 'စေတနာဖြင့် ဖန်တီးခြင်း',
    goodwillDesc: 'ဤစနစ်ကို ဓမ္မဒါနကုသိုလ်အဖြစ် နည်းပညာဖြင့် အကျိုးပြုလိုသော တက္ကသိုလ်ကျောင်းသားတစ်ဦးမှ စေတနာသဒ္ဓါတရားဖြင့် ကြိုးပမ်းဖန်တီးထားခြင်း ဖြစ်ပါသည်။',
    disclaimerTitle: 'ရှင်းလင်းချက်',
    disclaimerDesc: 'ဤဝက်ဘ်ဆိုက်သည် သက်ဆိုင်ရာ သုတဓမ္မစာမေးပွဲ ကျင်းပရေးကော်မတီ (သို့မဟုတ်) တရားဝင်အဖွဲ့အစည်းများနှင့် တိုက်ရိုက်ပတ်သက်မှု၊ ထောက်ခံမှု သို့မဟုတ် အသိအမှတ်ပြုမှု ရယူထားခြင်း မရှိပါ။ ဤဝက်ဘ်ဆိုက်ပါ အချက်အလက်များနှင့် မေးခွန်းများအားလုံးသည် သုတဓမ္မ ဒီပလိုမာတန်းနှင့် ဝိဇ္ဇာဘွဲ့တန်း ဖြေဆိုမည့်သူများ စာမေးပွဲအတွက် ကြိုတင်လေ့ကျင့်နိုင်ရန်နှင့် ဓမ္မဗဟုသုတ မျှဝေရန် ရည်ရွယ်ချက်သက်သက်ဖြင့်သာ ဖန်တီးထားခြင်းဖြစ်ပြီး တရားဝင်စာမေးပွဲ ကျင်းပခြင်း ကိစ္စရပ်များနှင့် လုံးဝသက်ဆိုင်ခြင်း မရှိပါ။',
    blessingText: 'ဓမ္မမိတ်ဆွေများအားလုံး သုတဓမ္မစာမေးပွဲများကို လွယ်ကူချောမွေ့စွာ ဖြေဆိုနိုင်ပြီး တရားဓမ္မအသိဉာဏ်များ တိုးပွားနိုင်ကြပါစေဟု ဆုတောင်းမေတ္တာ ပို့သအပ်ပါသည်။',
    startPracticeBtn: 'ယခု လေ့ကျင့်မည်'
  },
  en: {
    heroTag: 'About Us',
    heroTitle: 'Suta Dhama Quizzes',
    heroSubtitle: 'University of Wisdom Land annually holds the Suta Dhama examinations for the perpetuation of the Sasana (the Buddhist teachings). The Suta Dhama Quizzes website is a free practice platform created for Dhamma friends across Myanmar who are attending the Suta Dhama Diploma and B.A. courses, allowing them to practice in advance before their exams.',
    objectiveTitle: 'Our Objective',
    objectiveDesc: 'We aim to enable Dhamma friends of all ages to conveniently and easily study and memorize Dhamma literature via their mobile phones or computers, without facing any technical difficulties. The platform is specially designed to be accessible for practice at any time without the need to create an account.',
    featuresTitle: 'Features of this Website',
    features: [
      {
        title: 'Completely Free',
        desc: 'This is strictly a zero-profit project that requires no fees or payments whatsoever.'
      },
      {
        title: 'Easy to Use',
        desc: 'It utilizes clear Burmese fonts, large text sizes, and a clean color palette, making it especially suitable for older adults.'
      },
      {
        title: 'Systematic Practice',
        desc: 'Questions are proportionally distributed according to the chapters in the textbooks, and users can freely select the specific chapters they wish to practice.'
      },
      {
        title: 'Detailed Explanations',
        desc: 'Upon completing a quiz, users can review their score percentage, correct answers, and doctrinal explanations for comprehensive understanding.'
      }
    ],
    goodwillTitle: 'Created with Goodwill',
    goodwillDesc: 'This platform is lovingly developed by a university student as a Dhamma-Dana technological contribution with pure devotion and goodwill.',
    disclaimerTitle: 'Disclaimer',
    disclaimerDesc: 'This website is not directly affiliated with, endorsed, or approved by the relevant Suta Dhama Examination Committee or any official organizations. All information and questions on this website are created solely for the purpose of sharing Dhamma knowledge and helping students practice for the Suta Dhama Diploma and B.A. examinations. It has nothing to do with the official administration of the examinations.',
    blessingText: 'May all Dhamma friends sit for their Suta Dhama examinations smoothly and grow in wisdom and understanding of the Dhamma.',
    startPracticeBtn: 'Start Practicing Now'
  }
};
