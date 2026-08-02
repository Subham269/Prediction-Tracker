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
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-5xl font-bold mb-10 text-gray-800  mt-5">Stats</h1>
            <p className="text-3xl font-bold mb-10 text-gray-800">{correct} out of {attempted} predictions correct so far!</p>
            {predictions.map((prediction, index)=>
            
                (prediction.actualOutcome && (
                    <div className="flex flex-col border border-gray-200 rounded-xl p-4 mt-3 mb-3 bg-white/30  justify-center items-center text-xl" key={prediction.id}>
                        <p className="font-extrabold text-2xl" >{index+1}</p>
                        <p className="font-semibold ">Sport : {prediction.sport}</p>
                        <p>Match : {prediction.matchLabel}</p>
                        <p>Prediction : {prediction.predictedOutcome}</p>
                        <p>Actual : {prediction.actualOutcome}</p>
                        <p className={"mt-1 text-xl "+(
      prediction.isCorrect ? "text-green-600" : "text-red-500"
                            )}>{prediction.isCorrect ? '✅ Correct' : '❌ Wrong'}</p>
                    </div>
                    
    
                ))
            )}
        </div>
    )
}

export default Stats