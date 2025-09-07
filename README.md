# 🎯 Quiz App

A clean and responsive **Quiz Application built with React**.\
This project demonstrates front-end fundamentals, state management with
React hooks, and user-friendly UI/UX design.

------------------------------------------------------------------------

## 🚀 Features

-   📱 **Responsive Design** -- Works on both desktop and mobile.\
-   ❓ **Dynamic Quiz** -- Load 5--10 multiple-choice questions from
    [Open Trivia DB](https://opentdb.com/api_config.php) or a local JSON
    file.\
-   🧭 **Quiz Navigation** -- Next, Previous/Skip (optional), and
    Submit/Finish buttons.\
-   ✅ **Answer Validation** -- Prevents moving forward without
    selecting an answer.\
-   📊 **Score Tracking** -- Displays final score (e.g., *"You scored
    7/10"*).\
-   📋 **Results Page** -- Detailed summary of correct/incorrect
    answers.\
-   🔄 **Restart Quiz** -- Reset and try again.

### ✨ Bonus Features (if implemented)

-   ⏱️ Timer per question.\
-   📈 Progress indicator (e.g., "Question 3 of 10").\
-   🎮 Difficulty levels (easy/medium/hard).\
-   💾 Persistent high scores (localStorage).\
-   🎨 Subtle animations & accessibility enhancements.

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **React** (Functional Components + Hooks)\
-   **Tailwind CSS** (or Styled Components / CSS Modules)\
-   **React Router** (optional for navigation)\
-   **Open Trivia DB API** / Local JSON as data source

------------------------------------------------------------------------

## 📂 Project Structure

    quiz-app/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/    # Presentational components
    │   ├── pages/         # Quiz & Results pages
    │   ├── data/          # Local questions.json (if used)
    │   ├── App.js         # Main app logic
    │   ├── index.js       # Entry point
    │   └── styles/        # Tailwind / CSS files
    └── package.json

------------------------------------------------------------------------

## ⚡ Getting Started

### 1. Clone the repository

``` bash
git clone https://github.com/your-username/quiz-app.git
cd quiz-app
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Start development server

``` bash
npm start
```

### 4. Build for production

``` bash
npm run build
```

------------------------------------------------------------------------

## 🌐 Deployment

You can deploy the app easily using:\
- **GitHub Pages**\
- **Netlify**\
- **Vercel**

Example (Netlify):

``` bash
npm run build
netlify deploy
```

------------------------------------------------------------------------

## 📖 Documentation

-   Handles API loading & error states.\
-   Prevents skipping without an answer (unless Skip is explicitly
    enabled).\
-   Mobile responsive and tested against rapid clicks, refreshes, and
    empty data.\
-   Code includes comments for clarity.

------------------------------------------------------------------------

## 👨‍💻 Author

Developed as part of a coding challenge.\
📩 For queries: <hiring@todaypay.me>

------------------------------------------------------------------------

## 🎉 Live Demo

👉 [Demo Link Here](https://quiz-app-problem.vercel.app/)
