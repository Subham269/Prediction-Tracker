import {toast} from 'sonner'
import {useState, useEffect} from 'react'
function Cricket()
{
    const [submitting,setSubmitting]=useState(false);
    const [matches, setMatches]=useState([])
    const [predictions,setPredictions]=useState([])

    
   useEffect(()=> {
    fetch('http://localhost:3000/api/matches?sport=cricket')
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

   const handlePredict=(matchId,PredictedOutcome)=> {
                setSubmitting(true);
                    fetch('http://localhost:3000/api/predictions', 
                    {
                        method : 'POST',
                        headers : {
                            "Content-Type" : "application/json"
                        },
                        body: JSON.stringify({
                            predictedOutcome : PredictedOutcome,
                            matchId: matchId
                        })
                    }
                )
                .then(res=>res.json())
                .then(data => {
                    if(data.id)
                    {
                        toast.success('Prediction Made Succesfully!')
                        setPredictions(prevPredictions => [...prevPredictions,data]);
                    }
                    else 
                    {
                        toast.error('Could Not Save Prediction. Try again')
                    }})
                .catch(()=> {
                    toast.error('Could Not Save Prediction. Try again');
                })
                .finally(()=>{
                    setSubmitting(false);
                })
}
    
    
    return (
        <>
        {matches.length===0 && <p>No Matches Yet!</p>}
        {matches.map((match)=>{
        const alreadyPredicted = predictions.some(p => p.matchId === match.id);
        return (
       <div className="relative" key={match.id}>
            <button disabled={submitting || alreadyPredicted} onClick={() => handlePredict(match.id, match.team1)}>
            {match.team1}</button>
            
            <button disabled={submitting || alreadyPredicted} onClick={() => handlePredict(match.id, match.team2)}>
            {match.team2}</button>
            {alreadyPredicted && <p className="absolute">Prediction made!</p>}
    </div>)


    })}
    </>
    )
}

export default Cricket