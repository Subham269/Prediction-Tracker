import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import heroImg from '@/assets/Cricket-bro.svg'
import { BarChartBig, Lightbulb, TrendingUp, CloudSun, Users, Radio } from "lucide-react"
import {useAuth} from '@/context/AuthContext.jsx'
import  apiFetch  from '@/lib/api'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Leaderboard() 
{
    const {user} = useAuth();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(true);
    const [rows,setRows] = useState(null);

    useEffect(()=>{
        let cancelled = false;
        fetch('http://localhost:3000/api/leaderboard')
            .then((response) => {
                !cancelled && response.json()})
            .then((data) => {
                !cancelled &&
                setRows(data)
            })
            .catch((err) => {
                !cancelled &&
                setError(err);
            })
            .finally(()=>{
                !cancelled &&
                setLoading(false);
            })
    },[])

    return ( 
            <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
                    {/* LeaderBoard / Hero */}
                    <section className="shadow-lg bg-gradient-to-r from-green-50 to-white dark:from-green-950 dark:to-background rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-green-600">
                                Leaderboard
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
            </div>
    )


}