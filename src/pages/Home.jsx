import { Target, BarChart3, Trophy, Zap } from "lucide-react";
import {Card, CardContent} from '@/components/ui/card'
import heroImg from '@/assets/hero_img.svg'
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
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
            {/* Welcome / Hero */}
            <section className="shadow-lg bg-gradient-to-r from-green-50 to-white dark:from-green-950 dark:to-background rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Welcome to <span className="text-green-600">PredictionOS</span>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground text-center">
                    Predict matches, track your accuracy, and compete on the leaderboard.
                </p>
                </div>
                <img
                src={heroImg}
                alt="Prediction illustration"
                className="w-64 md:w-96 shrink-0"
                />
            </section>

            {/* Stats */}
            <section>
                <div className="shadow-[0_0_20px_rgba(0,0,0,0.08)] p-4 md:p-6 rounded-2xl">
                <h2 className="text-2xl font-semibold mb-4 text-green-600">Your Stats</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Predictions" value={total} />
                <StatCard label="Correct Predictions" value={correct} valueClass="text-green-600" />
                <StatCard label="Accuracy" value={`${accuracy}%`} valueClass="text-green-600" />
                <StatCard label="Win Streak" value={`🔥 ${streak}`} />
                </div>
                </div>
            </section>

            {/* Features */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FeatureCard icon={Target} title="Smart Predictions" desc="Make intelligent predictions and track your accuracy over time." />
                <FeatureCard icon={BarChart3} title="Detailed Statistics" desc="Analyze your performance with detailed stats and insights." />
                <FeatureCard icon={Trophy} title="Leaderboards" desc="Compete with others and climb the global leaderboard." />
                <FeatureCard icon={Zap} title="Real-time Updates" desc="Get live scores, results, and match updates instantly." />
            </section>


        </div>
    )
}

function StatCard({ label, value, valueClass = "" }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-lg text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${valueClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <Card>
      <CardContent className="p-5 flex gap-3">
        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg h-fit">
          <Icon className="text-green-600 stroke-3" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default Home