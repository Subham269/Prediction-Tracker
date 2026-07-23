import {useState, useEffect} from 'react'
function Football()
{
    const [form,setForm]= useState(
        {
            matchLabel: '' , 
            predictedOutcome: '' 
        }   
    )
    const [predictions,setPredictions]= useState([])

    function handleSubmit(e)
    {
        e.preventDefault();

        const newPrediction = {
            id:crypto.randomUUID(),
            sport : 'football',
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

    return (
        <div>
            <form onSubmit={(event)=>handleSubmit(event)}>
                <input value={form.matchLabel} onChange={(e)=>setForm({...form, matchLabel: e.target.value})} type="text" placeholder="Enter Match"></input>
                <input value={form.predictedOutcome} onChange={(e)=>setForm({...form, predictedOutcome : e.target.value})} type="text" placeholder="Enter Prediction"></input>
                <button type="submit">Submit</button>
                {predictions.map((prediction)=> (
                    prediction.sport==='football' && <div key={prediction.id}>
                        <p>{prediction.matchLabel}</p>
                        <p>{prediction.predictedOutcome}</p>
                    </div>
                ))}
            </form>
        </div>
    )
}

export default Football