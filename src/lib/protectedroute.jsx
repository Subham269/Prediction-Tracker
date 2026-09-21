import {useAuth} from '@/context/AuthContext.jsx'
import {useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import { toast } from 'sonner'


export default function ProtectedRoute({ children }) {
    const { token, setAuthModal } = useAuth();
    const navigate=useNavigate();
    let hasShownToast = false;

    useEffect(() => {
        if (!token && !hasShownToast) {
            hasShownToast= true;
            toast.error('Please Log in to view LeaderBoard')
            setAuthModal("login");
            navigate("/", { replace: true });
        }
    }, [token, setAuthModal, navigate]);

    if (!token) {
        return null; 
    }

    return children;
}