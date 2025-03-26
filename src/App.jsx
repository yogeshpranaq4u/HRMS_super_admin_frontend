import { useState } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './LoginPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<LoginPage />}></Route>
   
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
