import {useState, useEffect} from 'react'
function Cricket()
{
    const [matches, setMatches]=useState([])
    const [predictions,setPredictions]=useState([])

    
   useEffect(()=> {
    fetch('http://localhost:3000/api/matches')
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
        <div>
            {matches.map((match)=>{
                
            })}
        </div>

    )
}

export default Cricket