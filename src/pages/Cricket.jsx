import {useState, useEffect} from 'react'
function Cricket()
{
    const [activeId,setActiveId]=useState(null)
    const [outcomeInput,setOutcomeInput]=useState('')
    const [form,setForm]= useState(
        {
            matchLabel: '' , 
            predictedOutcome: '' ,
            actualOutcome: '',
            isCorrect: false
        }   
    )
    const [predictions,setPredictions]= useState([])

    function handleSubmit(e)
    {
        e.preventDefault();

        const newPrediction = {
            id:crypto.randomUUID(),
            sport : 'cricket',
            matchLabel : form.matchLabel,
            predictedOutcome: form.predictedOutcome,
            createdAt: new Date().toISOString() 
        }
        const updated = [...predictions,newPrediction]
        setPredictions(updated)
        localStorage.setItem("predictions",JSON.stringify(updated))
        
        setForm({
            matchLabel: '',
            predictedOutcome: ''
        })
    }
    useEffect(()=> {
        const savedPredictions= localStorage.getItem("predictions");

        if(savedPredictions)
        {
            setPredictions(JSON.parse(savedPredictions))
        }
    },[])

    function handleResult()
    {
        const updated = predictions.map((prediction) => {
            if(prediction.id===activeId)
            {
                return {
                    ...prediction,
                    actualOutcome: outcomeInput,
                    isCorrect: outcomeInput === prediction.predictedOutcome 
                }
            }
            return prediction
        })
        setPredictions(updated)
        localStorage.setItem("predictions",JSON.stringify(updated))
        setActiveId(null)
        setOutcomeInput('')
    }

    return (
        <div>
            <form onSubmit={(event)=>handleSubmit(event)}>
                <input value={form.matchLabel} onChange={(e)=>setForm({...form, matchLabel: e.target.value})} type="text" placeholder="Enter Match"></input>
                <input value={form.predictedOutcome} onChange={(e)=>setForm({...form, predictedOutcome : e.target.value})} type="text" placeholder="Enter Prediction"></input>
                <button type="submit">Submit</button>
                {predictions.map((prediction)=> (
                    prediction.sport==='cricket' && <div key={prediction.id}>
                        <p>{prediction.matchLabel}</p>
                        <p>{prediction.predictedOutcome}</p>
                        {!prediction.actualOutcome && (
                        <button type="button" onClick={()=>setActiveId(prediction.id)}>Record Result</button>
                        )}
                        {prediction.actualOutcome && (
                            <p>Actual: {prediction.actualOutcome} — {prediction.isCorrect ? '✅ Correct' : '❌ Wrong'}</p>
                            )}
                        {prediction.id===activeId && (
                        <div>
                            <input value={outcomeInput} type="text" onChange={(e)=>setOutcomeInput(e.target.value)}></input>
                           <button type="button" onClick={()=>handleResult()}>Check!</button>
                        </div>
                        )}
                    </div>
                ))}
            </form>
        </div>
    )
}

export default Cricket