import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import heroImg from '@/assets/Cricket-bro.svg'
import {useAuth} from '@/context/AuthContext.jsx'
import  apiFetch  from '@/lib/api'
import {Skeleton} from '@/components/ui/skeleton'
import { cn } from "@/lib/utils"
import {useNavigate} from 'react-router-dom'


const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Leaderboard() 
{
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [rows,setRows] = useState([]);
    const { user, token} = useAuth();


    useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
        try {
            setLoading(true);
            setError(null);
            const response = await apiFetch(
            'http://localhost:3000/api/leaderboard',
            {},
            token
        );
            if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            
            if (!cancelled) {
                const data = await response.json();
                setRows(data);
            }
        } 
        catch (error) {
            if (!cancelled) {
                setError(error.message || 'Failed to load leaderboard');
            }
        } 
        finally {
            if (!cancelled) {
                setLoading(false);
            }
        }
    }

    if (token) {
        loadLeaderboard();
    }

    return () => {
        cancelled = true;
    };
    }, [token]);
    console.log(rows)
    return (
            <>
                <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
                        {/* LeaderBoard / Hero */}
                        <section className="shadow-lg bg-gradient-to-r from-green-50 to-white dark:from-green-950 dark:to-background rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-xl text-center md:text-left">
                                <h1 className="text-6xl md:text-5xl font-bold tracking-tight ">
                                    Leader<span className="text-green-600">Board</span>
                                </h1>
                                <p className="mt-4 text-2xl text-muted-foreground text-center md:text-left">
                                    Predict. Compete. Rise to the Top.
                                </p>
                            </div>
                            <img
                                src={heroImg}
                                alt="Prediction illustration"
                                className="w-64 md:w-96 shrink-0"
                            />
                        </section>
                
                        {loading && (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 justify-center max-w-6xl mx-auto px-4 " />
                                ))}
                            </div>
                        )}

                {error && <p className="text-sm text-destructive">{error}</p>}
                
                 {!loading && !error && rows.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No one has scored yet. Settle a prediction to get on the board.
                </p>
                )}

                {!loading && !error && rows.length > 0 && (
                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b bg-muted/50">
                        <th className="w-20 px-6 py-3.5 text-center text-lg font-medium text-muted-foreground">Rank</th>
                        <th className="px-4 py-3.5 text-left text-lg font-medium text-muted-foreground">Player</th>
                        <th className="px-6 py-3.5 text-center text-lg font-medium text-muted-foreground">Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row) => {
                        const isMe = row.username === user?.username; // or row.id === user?.id
                        return (
                        <tr
                            key={row.id}
                            className={cn(
                            'border-b transition-colors last:border-0',
                            isMe
                                ? 'bg-green-50 font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-400'
                                : 'hover:bg-muted/40'
                            )}
                        >
                            <td className="px-6 py-3.5 text-center text-base">
                            {MEDALS[row.rank] ?? row.rank}
                            </td>
                            <td className="px-4 py-3.5 text-base font-medium">
                            {row.username}
                            {isMe && (
                                <span className="ml-3 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                                (you)
                                </span>
                            )}
                            </td>
                            <td
                            className={cn(
                                'px-6 py-3.5 text-right text-base font-medium tabular-nums',
                                row.rank === 1 && 'font-bold text-green-600 dark:text-green-400'
                            )}
                            >
                            {row.points}
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
                </div>
                )}
                </div>
            </>

    )


}