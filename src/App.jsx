import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Routings from './Routes/Routings'
import Cart from './pages/Cart'

function App() {
  const[showCart, setShowCart] = useState(false)
  console.log(showCart);
  
  return (
    <div>
      <Header setShowCart={setShowCart}/>
      <Routings/>
      <Cart showCart={showCart} setShowCart={setShowCart}/>
    </div>
  )
}

export default App
