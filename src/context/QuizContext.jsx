import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAvailableChapters, fetchProportionalQuestions } from '../services/questionService';
import { parseLevelNumber } from '../utils/formatters';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [selectedCourse, setSelectedCourse] = useState('diploma'); // 'diploma' | 'ba'
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionCount, setQuestionCount] = useState(20);

  // Active Quiz Running State
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);

  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState(null);

  // Load available chapters whenever course or level changes
  const loadChaptersForSelection = async (course, level) => {
    setIsLoadingChapters(true);
    try {
      const courseType = course === 'diploma' ? 'Diploma' : 'BA';
      const levelNum = parseLevelNumber(level);
      const chapters = await getAvailableChapters(courseType, levelNum);
      setAvailableChapters(chapters);
      setSelectedChapters(chapters); // Default: all selected
    } catch (err) {
      console.error('Error fetching chapters:', err);
    } finally {
      setIsLoadingChapters(false);
    }
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleSelectLevel = async (level) => {
    setSelectedLevel(level);
    await loadChaptersForSelection(selectedCourse, level);
  };

  const toggleChapter = (chapter) => {
    setSelectedChapters((prev) => {
      if (prev.includes(chapter)) {
        return prev.filter((c) => c !== chapter);
      } else {
        return [...prev, chapter];
      }
    });
  };

  const selectAllChapters = () => {
    if (selectedChapters.length === availableChapters.length) {
      setSelectedChapters([]);
    } else {
      setSelectedChapters([...availableChapters]);
    }
  };

  const handleStartQuiz = async () => {
    setIsQuizLoading(true);
    setQuizError(null);

    try {
      const courseType = selectedCourse === 'diploma' ? 'Diploma' : 'BA';
      const levelNum = parseLevelNumber(selectedLevel);
      const questions = await fetchProportionalQuestions(
        courseType,
        levelNum,
        questionCount,
        selectedChapters
      );

      setQuizQuestions(questions);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setQuizScore(null);
      return true;
    } catch (err) {
      console.error('Quiz fetch error:', err);
      setQuizError(err.message || 'မေးခွန်းများ ရယူရာတွင် အမှားအယွင်း ဖြစ်ပေါ်ခဲ့ပါသည်။');
      return false;
    } finally {
      setIsQuizLoading(false);
    }
  };

  const selectAnswer = (optionKey) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionKey
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const skipQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const submitQuiz = () => {
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_option) {
        correctCount++;
      }
    });

    const total = quizQuestions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const answered = Object.keys(userAnswers).length;
    const unanswered = total - answered;

    const scoreResult = {
      correct: correctCount,
      total,
      percentage,
      unanswered
    };

    setQuizScore(scoreResult);
    return scoreResult;
  };

  const resetQuiz = () => {
    setQuizQuestions([]);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setQuizScore(null);
  };

  return (
    <QuizContext.Provider
      value={{
        selectedCourse,
        selectedLevel,
        setSelectedCourse: handleSelectCourse,
        setSelectedLevel: handleSelectLevel,
        loadChaptersForSelection,
        availableChapters,
        selectedChapters,
        toggleChapter,
        selectAllChapters,
        questionCount,
        setQuestionCount,
        quizQuestions,
        currentQuestionIndex,
        userAnswers,
        quizScore,
        reviewQuestionIndex,
        setReviewQuestionIndex,
        isLoadingChapters,
        isQuizLoading,
        quizError,
        startQuiz: handleStartQuiz,
        selectAnswer,
        nextQuestion,
        prevQuestion,
        skipQuestion,
        jumpToQuestion,
        submitQuiz,
        resetQuiz
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
