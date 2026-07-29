import {useEffect,useState} from 'react'
function Stats()
{
    const [predictions,setPredictions]=useState([]);
    useEffect(()=>{
        const savedPredictions=localStorage.getItem("predictions")
    
    if(savedPredictions)
    {
        setPredictions(JSON.parse(savedPredictions))
    }},[])
    const attempted=predictions.filter(p=>p.actualOutcome).length
    const correct=predictions.filter(p=>p.isCorrect).length

    return (
        <div>
            <p>{correct} out of {attempted} predictions correct so far!</p>
            {predictions.map((prediction, index)=>
            
                (prediction.actualOutcome && (
                    <div key={prediction.id}>
                        <p>{index+1}</p>
                        <p>{prediction.sport}</p>
                        <p>{prediction.matchLabel}</p>
                        <p>{prediction.predictedOutcome}</p>
                        <p>{prediction.actualOutcome}</p>
                        <p>{prediction.isCorrect ? '✅ Correct' : '❌ Wrong'}</p>
                    </div>
                    
    
                ))
            )}
        </div>
    )
}

export default Stats