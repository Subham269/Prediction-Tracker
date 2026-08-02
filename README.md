# 🏆 Sports Prediction Tracker

A React app that lets you log your sports predictions before matches happen, record what actually happened afterward, and track your accuracy over time.

🔗 Live Demo: [https://prediction-tracker-subham.netlify.app/]

React · React Router · Tailwind CSS · Netlify

## ✨ Features

🔍 Log predictions for Cricket and Football before a match
✅ Manually Record actual results once the match is over
📊 Live accuracy stats — correct vs. total attempted
🗂️ Full prediction history
💾 Data persists across sessions via localStorage
🎨 Clean, responsive UI with a custom gradient theme

## 🛠️ Built With

- React (functional components + hooks)
- Vite for fast dev/build tooling
- React Router for multi-page navigation
- Tailwind CSS for styling
- localStorage for client-side persistence
- Netlify for deployment

## ⚙️ How It Works

Each prediction is stored as an object — match label, your predicted outcome, and (once known) the actual outcome. Recording a result uses an immutable update pattern (`.map()` + spread) to find and update the matching prediction without disturbing the rest of the history. Stats are calculated live by filtering the full prediction list on every render — no separate counters to keep in sync, so the numbers can never drift out of date.

## 🚀 Getting Started

Clone the repo and run it locally:

```bash
git clone https://github.com/Subham269/Prediction-Tracker
cd prediction-tracker
npm install
npm run dev
```

## 📸 Preview

![alt text](<Screenshot 2026-08-02 213742.png>)
![alt text](<Screenshot 2026-08-02 213759.png>)
![alt text](<Screenshot 2026-08-02 213824.png>)

## 📚 What I Learned

This project was built as a hands-on way to practice:

- Multi-page routing and shared layout with React Router
- Managing multiple related pieces of state (form state vs. active state vs seasonal states)
- Reading/writing structured data to localStorage with JSON implementation
- Immutable state updates on arrays of objects — adding, and finding-and-updating a single item
- Conditional rendering and conditional styling based on data
- Debugging real logic bugs (stale state closures, button `type` defaults inside forms, scoping issues)
- Using TailWind CSS to give a modern UI to the app

## 🔮 Future Improvements

- Node.js + Express backend with a real database
- Multi-device sync
- Auto-fetch real match data via a public sports API
- A page dedicated to MMA 

Made by Subham Saha — follow the build journey on [LinkedIn](https://www.linkedin.com/in/subham-saha-72ab062a3/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_recent_activity_content_view%3BdPmW9iW3TruMUjHcrQuGeQ%3D%3D).