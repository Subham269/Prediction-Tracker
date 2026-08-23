import {Routes,Route} from 'react-router-dom'
import Cricket from './pages/Cricket'
import Football from './pages/Football'
import Stats from './pages/Stats'
import Home from './pages/Home'
import { Toaster } from 'sonner'
import AppSidebar from './components/ui/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

function App()
{
    return (
        <>
        <div className="flex min-h-screen [background:radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.35),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.30),transparent_35%),#06100F]">

            <Toaster position="top-center" richColors></Toaster>

            <SidebarProvider className="bg-transparent">
                
            
                

                    <AppSidebar/>
                    <main className="flex-1 bg-transparent">
                        <Routes>
                            <Route path='/' element={<Home/>}></Route>
                            <Route path='/Cricket' element={<Cricket/>}></Route>
                            <Route path='/Football' element={<Football/>}></Route>
                            <Route path='/Stats' element={<Stats/>}></Route>
                        </Routes>
                    </main>
                
            </SidebarProvider>
            </div>
        </>
    )
}

export default App