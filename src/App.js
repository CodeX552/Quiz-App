import React, { useState, useEffect } from 'react';
import { Clock, RotateCcw, CheckCircle, XCircle, Trophy, Target, Zap } from 'lucide-react';

// Local questions data
const LOCAL_QUESTIONS = [
  {
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Rome"],
    difficulty: "easy"
  },
  {
    question: "Which planet is known as the Red Planet?",
    correct_answer: "Mars",
    incorrect_answers: ["Venus", "Jupiter", "Saturn"],
    difficulty: "easy"
  },
  {
    question: "What is the largest ocean on Earth?",
    correct_answer: "Pacific Ocean",
    incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    difficulty: "medium"
  },
  {
    question: "Who painted the Mona Lisa?",
    correct_answer: "Leonardo da Vinci",
    incorrect_answers: ["Pablo Picasso", "Vincent van Gogh", "Michelangelo"],
    difficulty: "medium"
  },
  {
    question: "What is the chemical symbol for gold?",
    correct_answer: "Au",
    incorrect_answers: ["Ag", "Fe", "Cu"],
    difficulty: "hard"
  },
  {
    question: "In which year did World War II end?",
    correct_answer: "1945",
    incorrect_answers: ["1944", "1946", "1943"],
    difficulty: "medium"
  },
  {
    question: "What is the smallest prime number?",
    correct_answer: "2",
    incorrect_answers: ["1", "3", "0"],
    difficulty: "hard"
  },
  {
    question: "Which programming language is known as the 'language of the web'?",
    correct_answer: "JavaScript",
    incorrect_answers: ["Python", "Java", "C++"],
    difficulty: "easy"
  }
];

const QuizApp = () => {
  const [gameState, setGameState] = useState('home'); // 'home', 'quiz', 'results'
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timer > 0 && gameState === 'quiz') {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && timerActive) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [timer, timerActive, gameState]);

  // Load high scores from memory
  const [highScores, setHighScores] = useState(() => {
    // Simulating localStorage behavior with component state
    return [];
  });

  const fetchTriviaQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=8&difficulty=${difficulty}&type=multiple`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const formattedQuestions = data.results.map(q => ({
          question: decodeHtml(q.question),
          correct_answer: decodeHtml(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map(ans => decodeHtml(ans)),
          difficulty: q.difficulty
        }));
        setQuestions(formattedQuestions);
      } else {
        throw new Error('No questions received');
      }
    } catch (err) {
      console.log('API failed, using local questions');
      const filteredQuestions = LOCAL_QUESTIONS.filter(q => q.difficulty === difficulty);
      if (filteredQuestions.length === 0) {
        setQuestions(LOCAL_QUESTIONS);
      } else {
        setQuestions(filteredQuestions);
      }
    }
    setLoading(false);
  };

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const startQuiz = async () => {
    await fetchTriviaQuestions();
    setGameState('quiz');
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setAnswers([]);
    setScore(0);
    setTimer(30);
    setTimerActive(true);
  };

  const handleAnswerSelect = (answer) => {
    if (!timerActive) return;
    setSelectedAnswer(answer);
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    if (selectedAnswer === '') {
      setSelectedAnswer('Time Up');
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === '' && timerActive) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    const answerData = {
      question: currentQuestion.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correct_answer,
      isCorrect: isCorrect,
      options: [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers].sort(() => Math.random() - 0.5)
    };

    setAnswers(prev => [...prev, answerData]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setTimer(30);
      setTimerActive(true);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setTimerActive(false);
    setGameState('results');
    
    // Add to high scores
    const newScore = {
      score: score + (selectedAnswer === questions[currentQuestionIndex]?.correct_answer ? 1 : 0),
      total: questions.length,
      difficulty: difficulty,
      date: new Date().toLocaleDateString()
    };
    setHighScores(prev => [...prev, newScore].slice(-5)); // Keep last 5 scores
  };

  const restartQuiz = () => {
    setGameState('home');
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setAnswers([]);
    setScore(0);
    setTimer(30);
    setTimerActive(false);
    setShowResults(false);
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform hover:scale-105 transition-transform duration-300">
        <div className="mb-6">
          <Trophy className="mx-auto text-yellow-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Challenge</h1>
          <p className="text-gray-600">Test your knowledge and compete for high scores!</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Difficulty
          </label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="easy">🟢 Easy</option>
            <option value="medium">🟡 Medium</option>
            <option value="hard">🔴 Hard</option>
          </select>
        </div>

        <button
          onClick={startQuiz}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Loading Questions...
            </div>
          ) : (
            'Start Quiz'
          )}
        </button>

        {highScores.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Recent Scores</h3>
            {highScores.slice(-3).map((score, index) => (
              <div key={index} className="text-sm text-gray-600 flex justify-between">
                <span>{score.score}/{score.total}</span>
                <span className="capitalize">{score.difficulty}</span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (questions.length === 0) return <div>Loading...</div>;

    const currentQuestion = questions[currentQuestionIndex];
    const options = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers]
      .sort(() => Math.random() - 0.5);
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <Target className="text-blue-500" size={24} />
                <span className="text-lg font-semibold text-gray-700">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className={`${timer <= 10 ? 'text-red-500' : 'text-blue-500'}`} size={20} />
                <span className={`font-bold ${timer <= 10 ? 'text-red-500' : 'text-blue-500'}`}>
                  {timer}s
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {/* Score */}
            <div className="text-right">
              <span className="text-sm text-gray-600">Score: </span>
              <span className="font-bold text-green-600">{score}/{questions.length}</span>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>
            
            <div className="space-y-3">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={!timerActive}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current mr-3 flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-b-2xl p-6 shadow-lg">
            <div className="flex justify-between">
              <button
                onClick={restartQuiz}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Quit Quiz
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === '' && timerActive}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const finalScore = answers.filter(answer => answer.isCorrect).length;
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    let performanceLevel = '';
    let performanceColor = '';
    
    if (percentage >= 80) {
      performanceLevel = 'Excellent!';
      performanceColor = 'text-green-600';
    } else if (percentage >= 60) {
      performanceLevel = 'Good Job!';
      performanceColor = 'text-blue-600';
    } else if (percentage >= 40) {
      performanceLevel = 'Not Bad!';
      performanceColor = 'text-yellow-600';
    } else {
      performanceLevel = 'Keep Practicing!';
      performanceColor = 'text-red-600';
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 text-center">
            <Trophy className="mx-auto text-yellow-500 mb-4" size={64} />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
            <div className="text-6xl font-bold mb-2">
              <span className="text-green-600">{finalScore}</span>
              <span className="text-gray-400">/{questions.length}</span>
            </div>
            <div className={`text-2xl font-semibold ${performanceColor} mb-4`}>
              {performanceLevel}
            </div>
            <div className="text-lg text-gray-600">
              You scored {percentage}% • Difficulty: <span className="capitalize font-semibold">{difficulty}</span>
            </div>
          </div>

          {/* Answer Review */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Answer Review</h2>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  answer.isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 flex-1 mr-4">
                      {index + 1}. {answer.question}
                    </h3>
                    {answer.isCorrect ? (
                      <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                    ) : (
                      <XCircle className="text-red-500 flex-shrink-0" size={24} />
                    )}
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium">Your answer: </span>
                      <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {answer.userAnswer}
                      </span>
                    </div>
                    {!answer.isCorrect && (
                      <div>
                        <span className="font-medium">Correct answer: </span>
                        <span className="text-green-600">{answer.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="text-center">
            <button
              onClick={restartQuiz}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <RotateCcw className="inline mr-2" size={20} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  switch (gameState) {
    case 'home':
      return renderHome();
    case 'quiz':
      return renderQuiz();
    case 'results':
      return renderResults();
    default:
      return renderHome();
  }
};

export default QuizApp;
