import {Routes,Route} from 'react-router-dom'
import Cricket from './pages/Cricket'
import Football from './pages/Football'
import Stats from './pages/Stats'
import Home from './pages/Home'
import { Toaster } from 'sonner'
import AppSidebar from './layouts/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppHeader  from './layouts/AppHeader'
import AppFooter  from './layouts/AppFooter'

function App()
{
      return (
    <div className="flex flex-col min-h-screen ">
        <Toaster position="top-center" richColors></Toaster>
      <AppHeader />

      <div className="flex flex-1 !top-[64px] !h-[calc(100svh-64px)]">
        <SidebarProvider>
          <AppSidebar/>
          <main className="flex-1">
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/Cricket' element={<Cricket/>} />
              <Route path='/Football' element={<Football/>} />
              <Route path='/Stats' element={<Stats/>} />
            </Routes>
          </main>
        </SidebarProvider>
      </div>
      <AppFooter/>
    </div>
  )
}

export default App