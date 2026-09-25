import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext.jsx'
import heroImg from '@/assets/Cricket-bro.svg'
import apiFetch from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

const teamToFlagCode = (team) => {
        const map = { Brazil: "br",
        Argentina: "ar",
        Germany: "de",
        France: "fr",
        Spain: "es",
        Portugal: "pt",
        Italy: "it",
        England: "gb-eng",
        Netherlands: "nl",
        Belgium: "be",
        Croatia: "hr",
        Uruguay: "uy",
        Mexico: "mx",
        USA: "us",
        Japan: "jp",
        "South Korea": "kr",
        Morocco: "ma",
        Senegal: "sn",
        Nigeria: "ng",
        Ghana: "gh",
        Egypt: "eg",
        Switzerland: "ch",
        Poland: "pl",
        Denmark: "dk",
        Sweden: "se",
        Serbia: "rs",
        Colombia: "co",
        Chile: "cl",
        Ecuador: "ec",
        "Saudi Arabia": "sa",
        Australia: "au",
        Canada: "ca",
        Wales: "gb-wls",
        Scotland: "gb-sct",
        "Ivory Coast": "ci",
        Cameroon: "cm",
        Tunisia: "tn",
        Algeria: "dz",
        "South Africa": "za",
        India: "in", 
        Australia: "au", 
        England: "gb-eng", 
        "New Zealand": "nz", 
        Pakistan: "pk", 
        "South Africa": "za", 
        "West Indies": "jm", 
        "Sri Lanka": "lk"                     };
        return map[team] || "un";
    };

export default function MyPredictions() {
    const { token } = useAuth();
    const [predictions, setPredictions] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            setPredictions([]);
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const response1 = await apiFetch("http://localhost:3000/api/predictions", {}, token);
                const response2 = await apiFetch("http://localhost:3000/api/matches", {}, token);

                if (!response1.ok || !response2.ok) {
                    throw new Error(`HTTP error! status: ${response1.status} and ${response2.status}`);
                }

                if (!cancelled) {
                    const data1 = await response1.json();
                    const data2 = await response2.json();
                    setPredictions(data1);
                    setMatches(data2);
                }
            } catch (err) {
                if (!cancelled) setError(err.message || 'Failed to load your predictions');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [token]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
            <section className="shadow-lg bg-gradient-to-r from-green-50 to-white dark:from-green-950 dark:to-background rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        My <span className="text-green-600">Predictions</span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground text-center md:text-left">
                        Every pick you've made, in one place.
                    </p>
                </div>
                <img src={heroImg} alt="Prediction illustration" className="w-64 md:w-96 shrink-0" />
            </section>

            {loading && (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                    ))}
                </div>
            )}

            {!loading && error && <p className="text-sm text-destructive">{error}</p>}

            {!loading && !error && predictions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    Make a prediction first to see your prediction history.
                </p>
            )}

            {!loading && !error && predictions.length > 0 && (
                <div className="space-y-4">
                    {predictions.map((prediction) => {
                        const match = matches.find((m) => m.id === prediction.matchId);
                        if (!match) return null; // match not loaded yet, or was deleted

                        return (
                            <div
                                key={prediction.id}
                                className="relative rounded-2xl border border-green-200 dark:border-green-900 shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 bg-white dark:bg-background flex flex-col md:flex-row items-center gap-4 md:gap-6"
                            >
                                <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 dark:bg-green-950 px-4 py-2 min-w-[64px]">
                                    <span className="text-xs text-muted-foreground uppercase">
                                        {new Date(match.date).toLocaleString("en-US", { month: "short" })}
                                    </span>
                                    <span className="text-lg font-bold">{new Date(match.date).getDate()}</span>
                                </div>

                                <div className="flex-1 flex items-center justify-center gap-6">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className={`fi fi-${teamToFlagCode(match.team1)} text-5xl rounded`} />
                                        <span className="font-medium">{match.team1}</span>
                                    </div>
                                    <span className="text-muted-foreground font-semibold">vs</span>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className={`fi fi-${teamToFlagCode(match.team2)} text-5xl rounded`} />
                                        <span className="font-medium">{match.team2}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2 min-w-[160px]">
                                    <span className="text-md text-muted-foreground">Your Prediction</span>

                                    {prediction.actualOutcome === null ? (
                                        <div className="flex flex-col items-center">
                                            <div className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium text-sm">
                                                ✓ {prediction.predictedOutcome}
                                            </div>
                                            <span className="text-[13px] text-muted-foreground text-center font-normal tracking-tight mt-1">
                                                Come back later to check if you're correct!
                                            </span>
                                        </div>
                                    ) : prediction.isCorrect === 'true' ? (
                                        <div className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium text-sm">
                                            ✓ Correct ({prediction.predictedOutcome})
                                        </div>
                                    ) : (
                                        <div className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-medium text-sm">
                                            ✗ Incorrect ({prediction.predictedOutcome})
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}