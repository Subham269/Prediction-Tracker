import {toast} from 'sonner'
import {useState, useEffect} from 'react'
function Cricket()
{
    const [matches, setMatches]=useState([])
    const [predictions,setPredictions]=useState([])

    
   useEffect(()=> {
    fetch('http://localhost:3000/api/matches?')
    .then(response=> response.json())
    .then(data => {
        setMatches(data)
    })
   },[])

   useEffect(()=> {
    fetch('http://localhost:3000/api/predictions')
    .then(response=> response.json())
    .then(data => {
        setPredictions(data)
    })
   },[])

    return (
        <>  
            {matches.length===0 && <p>No Matches Yet!</p>}

            {matches.map((match)=>(
            <div key={match.id}>
                <button  onClick={()=> {
                    fetch('http://localhost:3000/api/predictions', 
                    {
                        method : 'POST',
                        headers : {
                            "Content-Type" : "application/json"
                        },
                        body: JSON.stringify({
                            predictedOutcome : match.team1,
                            matchId: match.id
                        })
                    }
                )
                }}>{match.team1}</button>

                <button  onClick={()=> {
                    setSubmitting(true);
                    fetch('http://localhost:3000/api/predictions', 
                    {
                        method : 'POST',
                        headers : {
                            "Content-Type" : "application/json"
                        },
                        body: JSON.stringify({
                            predictedOutcome : match.team2,
                            matchId: match.id
                        })
                    }
                )
                .then(res=>res.json())
                .then(data => {
                    if(data.id)
                    {
                        toast.success('Prediction Made Succesfully!')
                        setPredictions(prevPredictions => [...prevPredictions,data]);
                        {matches.map((match)=>{
                            const alreadyPredicted=predictions.some(p=> p.matchId===match.id)

                            return (
                                <div className="relative" key={match.id}>
                                    <button disabled={submitting || alreadyPredicted} >{match.team1}</button>
                                    <button disabled={submitting || alreadyPredicted} >{match.team2}</button>
                                    
                                    {alreadyPredicted && (
                                    <p className="absolute">
                                        Prediction made!
                                    </p>)}    
                                </div>
                            )
                        })
                        }
                    }
                    else 
                    {
                        toast.error('Could Not Save Prediction. Try again')
                    }
                })
                }}
                >{match.team2}</button>
            </div>
                ))}
        </>

    )
}

export default Cricket