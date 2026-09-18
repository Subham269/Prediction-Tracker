
export default async function apiFetch(url ,options = {} , token)
{
    console.log("TOKEN INSIDE API:", token);
    const response = await fetch(url, {
        ...options, 
        headers : 
        {
            ...options.headers,
            authorization : `Bearer ${token}`,
            "Content-Type" : "application/json",
        },
    })

    return response ; 
}