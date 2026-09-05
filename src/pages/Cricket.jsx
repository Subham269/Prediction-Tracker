import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import heroImg from '@/assets/Cricket-bro.svg'
import { BarChartBig, Lightbulb, TrendingUp, CloudSun, Users, Radio } from "lucide-react"

function Cricket() {
    const [submitting, setSubmitting] = useState(false);
    const [matches, setMatches] = useState([])
    const [predictions, setPredictions] = useState([])

    useEffect(() => {
        fetch('http://localhost:3000/api/matches?sport=cricket')
            .then(response => response.json())
            .then(data => {
                setMatches(data)
            })
    }, [])

    useEffect(() => {
        fetch('http://localhost:3000/api/predictions')
            .then(response => response.json())
            .then(data => {
                setPredictions(data)
            })
    }, [])

    const handlePredict = (matchId, PredictedOutcome) => {
        setSubmitting(true);
        fetch('http://localhost:3000/api/predictions', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                predictedOutcome: PredictedOutcome,
                matchId: matchId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    toast.success('Prediction Made Successfully!')
                    setPredictions(prevPredictions => [...prevPredictions, data]);
                } else {
                    toast.error('Could Not Save Prediction. Try again')
                }
            })
            .catch(() => {
                toast.error('Could Not Save Prediction. Try again');
            })
            .finally(() => {
                setSubmitting(false);
            })
    }

    const predictions_c = predictions.filter(p => p.sport === "cricket")
    const total = predictions_c.length;
    const resolved = predictions_c.filter(p => p.actualOutcome !== null);
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

    sorted.reverse();

    let bestStreak = 0;
    let tempStreak = 0;
    for (const p of sorted) {
        if (p.isCorrect == "true")
            tempStreak++;
        else {
            bestStreak = Math.max(bestStreak, tempStreak);
            tempStreak = 0;
        }
    }

    const teamToFlagCode = (team) => {
        const map = { India: "in", Australia: "au", England: "gb-eng", "New Zealand": "nz", Pakistan: "pk", "South Africa": "za", "West Indies": "jm", "Sri Lanka": "lk" };
        return map[team] || "un";
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
            {/* Cricket / Hero */}
            <section className="shadow-lg bg-gradient-to-r from-green-50 to-white dark:from-green-950 dark:to-background rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Cricket<span className="text-green-600"> Predictions</span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground text-center md:text-left">
                        Predict the outcome, Show your skills and climb the Leaderboard.
                    </p>
                </div>
                <img
                    src={heroImg}
                    alt="Prediction illustration"
                    className="w-64 md:w-96 shrink-0"
                />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Left Column: Matches List */}
                <div className="md:col-span-7 space-y-4">
                    <h2 className="text-2xl font-bold mb-4">All Matches</h2>

                    {matches.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No Matches Yet!</p>
                    )}

                    {matches.map((match) => {
                        const alreadyPredicted = predictions.some(p => p.matchId === match.id);
                        const myPrediction = predictions.find(p => p.matchId === match.id);
                        
                        return (
                            <div
                                key={match.id}
                                className="relative rounded-2xl border border-green-200 dark:border-green-900 shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 bg-white dark:bg-background flex flex-col md:flex-row items-center gap-4 md:gap-6"
                            >
                                {/* Date badge */}
                                <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 dark:bg-green-950 px-4 py-2 min-w-[64px]">
                                    <span className="text-xs text-muted-foreground uppercase">
                                        {new Date(match.date).toLocaleString('en-US', { month: 'short' })}
                                    </span>
                                    <span className="text-lg font-bold">
                                        {new Date(match.date).getDate()}
                                    </span>
                                </div>

                                {/* Teams */}
                                <div className="flex-1 flex items-center justify-center gap-6">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className={`fi fi-${teamToFlagCode(match.team1)} text-3xl rounded`} />
                                        <span className="font-medium">{match.team1}</span>
                                    </div>

                                    <span className="text-muted-foreground font-semibold">vs</span>

                                    <div className="flex flex-col items-center gap-1">
                                        <span className={`fi fi-${teamToFlagCode(match.team2)} text-3xl rounded`} />
                                        <span className="font-medium">{match.team2}</span>
                                    </div>
                                </div>

                                {/* Prediction */}
                                <div className="flex flex-col items-center gap-2 min-w-[160px]">
                                    <span className="text-xs text-muted-foreground">Your Prediction</span>

                                    {alreadyPredicted ? (

                                        myPrediction.isCorrect === 'true' ? (
                                        <div className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium text-sm">
                                            ✓ Correct ({myPrediction.predictedOutcome})
                                        </div>
                                    ) : myPrediction.isCorrect === 'false' ? (
                                        <div className="flex flex-col px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-medium text-sm">
                                            ✗ Incorrect ({myPrediction.predictedOutcome})
                                        </div>
                                    ) :
                                        (<div className="flex flex-col items-center">
                                        <div className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium text-sm">
                                            ✓ {myPrediction?.predictedOutcome}
                                            
                                            
                                        </div>
                                        <span className="text-[11px] text-muted-foreground text-center font-normal tracking-tight mt-1">Come back later to check if you're correct!</span>
                                        </div>
                                    )) :
                                        (<div className="flex gap-2">
                                            <button
                                                disabled={submitting}
                                                onClick={() => handlePredict(match.id, match.team1)}
                                                className="px-3 py-2 rounded-lg border border-green-300 hover:bg-green-50 dark:hover:bg-green-950 text-sm font-medium disabled:opacity-50 transition-colors"
                                            >
                                                {match.team1}
                                            </button>
                                            <button
                                                disabled={submitting}
                                                onClick={() => handlePredict(match.id, match.team2)}
                                                className="px-3 py-2 rounded-lg border border-green-300 hover:bg-green-50 dark:hover:bg-green-950 text-sm font-medium disabled:opacity-50 transition-colors"
                                            >
                                                {match.team2}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Column: Stats & Tips */}
                <div className="md:col-span-5 space-y-6">
                    {/* Stats Card */}
                    <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-background space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-1.5 tracking-tighter">
                            <BarChartBig className="w-5 h-5 text-green-500" strokeWidth={2.5} /> Your Cricket Stats
                        </h2>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 shadow-sm rounded-lg bg-green-50 dark:bg-green-950">
                                <p className="text-sm text-muted-foreground">Total Predictions</p>
                                <p className="text-2xl font-bold">{total}</p>
                            </div>

                            <div className="p-3 rounded-lg shadow-sm bg-green-50 dark:bg-green-950">
                                <p className="text-sm text-muted-foreground">Correct Predictions</p>
                                <p className="text-2xl font-bold text-green-600">{correct}</p>
                            </div>

                            <div className="p-3 rounded-lg shadow-sm bg-green-50 dark:bg-green-950">
                                <p className="text-sm text-muted-foreground">Accuracy</p>
                                <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg shadow-sm bg-green-50 dark:bg-green-950">
                                <p className="text-sm text-muted-foreground">Win Streak 🔥</p>
                                <p className="text-2xl font-bold">{streak}</p>
                            </div>

                            <div className="p-3 rounded-lg shadow-sm bg-green-50 dark:bg-green-950">
                                <p className="text-sm text-muted-foreground">Best Streak 🏆</p>
                                <p className="text-2xl font-bold">{bestStreak}</p>
                            </div>
                        </div>
                    </div>

                    {/* Prediction Tips */}
                    <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-background space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-green-500" strokeWidth={2.5} /> Prediction Tips
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg shadow-sm bg-green-50 dark:bg-green-950">
                                <TrendingUp className="w-5 h-5 text-green-500 mt-1" strokeWidth={2.5} />
                                <div>
                                    <p className="font-medium text-lg">Check team form</p>
                                    <p className="text-sm text-muted-foreground">Recent performance matters a lot.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg shadow-sm bg-green-50 dark:bg-green-950">
                                <CloudSun className="w-5 h-5 text-green-500 mt-1" strokeWidth={2.5} />
                                <div>
                                    <p className="font-medium text-lg">Pitch & conditions</p>
                                    <p className="text-sm text-muted-foreground">Understand the pitch and weather.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg shadow-sm bg-green-50 dark:bg-green-950">
                                <Users className="w-5 h-5 text-green-500 mt-1" strokeWidth={2.5} />
                                <div>
                                    <p className="font-medium text-lg">Head to head</p>
                                    <p className="text-sm text-muted-foreground">Analyze past encounters.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg shadow-sm bg-green-50 dark:bg-green-950">
                                <Radio className="w-5 h-5 text-green-500 mt-1" strokeWidth={2.5} />
                                <div>
                                    <p className="font-medium text-lg">Stay updated</p>
                                    <p className="text-sm text-muted-foreground">Follow live updates before predicting.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Cricket;