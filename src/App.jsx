import {Routes,Route, Link} from 'react-router-dom'
import Cricket from './pages/Cricket'
import Football from './pages/Football'
import Stats from './pages/Stats'
import Home from './pages/Home'

function App()
{
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-yellow-300">
            <nav>
                <Link to='/Home'>Home</Link>
                <Link to='/Cricket'>Cricket</Link>
                <Link to='/Football'>Football</Link>
                <Link to='/Stats'>Stats</Link>
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