import {useState, useEffect} from 'react'
function Cricket()
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

    return (
        <div>
            <form onSubmit={(event)=>handleSubmit(event)}>
                <input onChange={()=>}
            </form>
        </div>
    )
}

export default Cricket