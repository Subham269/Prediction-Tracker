import {Routes,Route, Link} from 'react-router-dom'
import Cricket from './pages/Cricket'
import Football from './pages/Football'
import Stats from './pages/Stats'
import Home from './pages/Home'

function App()
{
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-yellow-300">
            <nav className="flex items-center justify-center gap-20 px-20 py-4">
                <Link to='/Home' className="px-7 py-3 bg-gray-300 rounded-lg font-medium text-2xl hover:bg-[#c4c9d1] transition-colors hover:scale-110 transition all">Home</Link>
                <Link to='/Cricket' className="px-7 py-3 bg-gray-300 rounded-lg font-medium text-2xl hover:bg-[#c4c9d1] transition-colors hover:scale-110 transition all">Cricket</Link>
                <Link to='/Football' className="px-7 py-3 bg-gray-300 rounded-lg font-medium text-2xl hover:bg-[#c4c9d1] transition-colors hover:scale-110 transition all">Football</Link>
                <Link to='/Stats' className="px-7 py-3 bg-gray-300 rounded-lg font-medium text-2xl hover:bg-[#c4c9d1] transition-colors hover:scale-110 transition all">Stats</Link>
            </nav>

            <Routes>
                <Route path='/Home' element={<Home/>}></Route>
                <Route path='/Cricket' element={<Cricket/>}></Route>
                <Route path='/Football' element={<Football/>}></Route>
                <Route path='/Stats' element={<Stats/>}></Route>
            </Routes>
        </div>
    )
}

export default App