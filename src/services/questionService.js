import { sortChapters } from '../utils/formatters';

// In-memory cache for loaded question files
const questionsCache = {};

/**
 * Loads questions for a given course and level from static JSON.
 * @param {'Diploma' | 'BA'} courseType
 * @param {number} levelNum
 * @returns {Promise<Array>}
 */
export async function loadQuestions(courseType, levelNum) {
  const normalizedCourse = courseType.toLowerCase() === 'diploma' ? 'diploma' : 'ba';
  const key = `${normalizedCourse}_${levelNum}`;

  if (questionsCache[key]) {
    return questionsCache[key];
  }

  const response = await fetch(`/data/questions/${key}.json`);
  if (!response.ok) {
    throw new Error(`မေးခွန်းများ ဖတ်ရှု၍ မရရှိပါ (${normalizedCourse.toUpperCase()} အဆင့် ${levelNum})`);
  }

  const data = await response.json();
  questionsCache[key] = data;
  return data;
}

/**
 * Gets unique, sorted chapters for a given course and level.
 * @param {'Diploma' | 'BA'} courseType
 * @param {number} levelNum
 * @returns {Promise<string[]>}
 */
export async function getAvailableChapters(courseType, levelNum) {
  const allQuestions = await loadQuestions(courseType, levelNum);
  const unique = Array.from(new Set(allQuestions.map(q => String(q.chapter || '1').trim()))).filter(Boolean);
  unique.sort(sortChapters);
  return unique;
}

/**
 * Proportional Quiz Data Fetching with Dynamic Chapter Filter and Cap Logic.
 * @param {'Diploma' | 'BA'} courseType
 * @param {number} levelNum
 * @param {number} targetCount
 * @param {string[]} chaptersToInclude
 * @returns {Promise<Array>}
 */
export async function fetchProportionalQuestions(courseType, levelNum, targetCount, chaptersToInclude) {
  const allQuestions = await loadQuestions(courseType, levelNum);

  // 1. Filter questions by selected chapters
  let filtered = allQuestions;
  if (chaptersToInclude && chaptersToInclude.length > 0) {
    const chaptersSet = new Set(chaptersToInclude.map(c => String(c).trim()));
    filtered = allQuestions.filter(q => chaptersSet.has(String(q.chapter).trim()));
  }

  if (!filtered || filtered.length === 0) {
    throw new Error('ရွေးချယ်ထားသော အခန်းများအတွက် မေးခွန်းများ ရှာမတွေ့ပါ။ အခြားအခန်းများကို ရွေးချယ်ပေးပါ။');
  }

  // 2. Count the total number of questions returned for these selected chapters
  const totalAvailable = filtered.length;

  // 3. The Cap Logic: If requested count > totalAvailable, cap quiz to totalAvailable
  const effectiveTarget = Math.min(targetCount, totalAvailable);

  // If effectiveTarget >= totalAvailable, return all questions shuffled
  if (effectiveTarget >= totalAvailable) {
    const allShuffled = [...filtered];
    for (let i = allShuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allShuffled[i], allShuffled[j]] = [allShuffled[j], allShuffled[i]];
    }
    return allShuffled;
  }

  // 4. Proportional distribution logic across selected chapters
  const grouped = {};
  filtered.forEach((q) => {
    const ch = String(q.chapter || '1').trim();
    if (!grouped[ch]) grouped[ch] = [];
    grouped[ch].push(q);
  });

  const chapters = Object.keys(grouped);
  const allocation = {};
  let allocatedSum = 0;
  let largestChapter = chapters[0];
  let largestSize = 0;

  chapters.forEach((ch) => {
    const chSize = grouped[ch].length;
    if (chSize > largestSize) {
      largestSize = chSize;
      largestChapter = ch;
    }
    const quota = Math.round((chSize / totalAvailable) * effectiveTarget);
    allocation[ch] = Math.min(quota, chSize);
    allocatedSum += allocation[ch];
  });

  // Handle rounding remainders by adjusting largest chapter
  let diff = effectiveTarget - allocatedSum;
  if (diff !== 0 && largestChapter) {
    const cur = allocation[largestChapter];
    const maxAvail = grouped[largestChapter].length;
    const newCnt = Math.max(0, Math.min(maxAvail, cur + diff));
    diff -= (newCnt - cur);
    allocation[largestChapter] = newCnt;

    if (diff !== 0) {
      for (const ch of chapters) {
        if (diff === 0) break;
        if (diff > 0 && allocation[ch] < grouped[ch].length) {
          allocation[ch]++;
          diff--;
        } else if (diff < 0 && allocation[ch] > 0) {
          allocation[ch]--;
          diff++;
        }
      }
    }
  }

  // 5. Randomly sample allocated questions from each chapter
  const sampledQuestions = [];
  chapters.forEach((ch) => {
    const count = allocation[ch] || 0;
    if (count > 0) {
      const pool = [...grouped[ch]];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      sampledQuestions.push(...pool.slice(0, count));
    }
  });

  // 6. Final shuffle of the aggregated quiz questions
  for (let i = sampledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sampledQuestions[i], sampledQuestions[j]] = [sampledQuestions[j], sampledQuestions[i]];
  }

  return sampledQuestions;
}
