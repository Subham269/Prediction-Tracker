import { useState } from "react";

import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {useNavigate} from 'react-router-dom'
import {useAuth} from '@/context/AuthContext.jsx'


function Login({authModal,setAuthModal}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error,setError] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e)
    {
        try {
            e.preventDefault();

            const LoginProcess = await fetch('http://localhost:3000/api/auth/login', {
                method : 'POST' , 
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    email,password
                })
            });

            const LoginData = await LoginProcess.json();

            if(!LoginProcess.ok)
            {
                setError(LoginData.error);
                return ;
            }

            login(LoginData.token, LoginData.user) // local storage
            navigate('/')
            setAuthModal('null')
        }
        catch(error)
        {
             setError('Unable to connect to server');
        }
    }  
    

    return (
        <div className="flex justify-center items-center ">

            <Dialog open= {authModal==='login'} onOpenChange={() => setAuthModal(null)}className="w-[400px]">
            <DialogContent className="w-[400px]">
                <DialogHeader>
                    <DialogTitle>Sign in to PredictionOS</DialogTitle>
                </DialogHeader>

                

                    <form className="space-y-4"  onSubmit={handleSubmit}>


                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>
                        <div>
                             {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>

                        <Button type="submit" className="w-full" onSubmit={handleSubmit}>
                            Login
                        </Button>

                        <p className= "text-center">
                        Don't Have an Account?{" "}
                        <button
                            type="button"
                            onClick={() => setAuthModal("signUp")}
                            className="text-[#06A248] hover:underline"
                        >
                            Sign Up
                        </button>
                        </p>


                    </form>

                </DialogContent>

            </Dialog>

        </div>
    );
}

export default Login;