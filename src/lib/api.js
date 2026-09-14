
export async function apiFetch(url ,options = {} , token)
{
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