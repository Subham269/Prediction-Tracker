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
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto px-6 py-10">
            <h1 className="text-5xl font-bold mb-10 text-gray-750">Cricket</h1>
            <form onSubmit={(event)=>handleSubmit(event)}>
                <input className="border border-gray-300 px-3 py-2 mr-6 bg-gray-300 rounded-lg font-medium text-xl" value={form.matchLabel} onChange={(e)=>setForm({...form, matchLabel: e.target.value})} type="text" placeholder="Enter Match"></input>
                <input className="border border-gray-300 px-3 py-2 mr-6 bg-gray-300 rounded-lg font-medium text-xl" value={form.predictedOutcome} onChange={(e)=>setForm({...form, predictedOutcome : e.target.value})} type="text" placeholder="Enter Prediction"></input>
                <button className="px-3 py-2" type="submit">Submit</button>
                {predictions.map((prediction)=> (
                    prediction.sport==='cricket' && <div className="flex flex-col justify-center items-center" key={prediction.id}>
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