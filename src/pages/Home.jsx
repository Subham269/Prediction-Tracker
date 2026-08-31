import {useState, useEffect } from 'react'
function Home()
{
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
    fetch("http://localhost:3000/api/predictions")
        .then(res => res.json())
        .then(data => setPredictions(data))
        .catch(err => console.error(err));
    }, []);

    const total = predictions.length;
    const resolved = predictions.filter(p => p.actualOutcome !== null);
    const correct = resolved.filter(p => p.isCorrect === "true").length;
    const accuracy = resolved.length
    ? ((correct / resolved.length) * 100).toFixed(1)
    : 0;

    const sorted = [...resolved].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    let streak = 0;
    for (const p of sorted) {
    if (p.isCorrect === "true") streak++;
    else break;
    }

    return (
        <div className="flex flex-col items-center justify-center px-6 py-16">
            <h1 className="text-5xl font-bold mb-10 text-gray-750">Home</h1>
            <p className="text-xl text-gray-600">Make your calls before the match. See how you actually did after !</p>
        </div>
    )
}

export default Home