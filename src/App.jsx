
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import AiChatbot from './components/AiChatbot'
import FixedFooter from './components/FixedFooter'

function App() {

  return (
    <div className='app-shell'>
    <Navbar/>
    <main className='app-main'>
      <Outlet/>
    </main>
    <FixedFooter />
    <AiChatbot />
    </div>
  )
}

export default App
