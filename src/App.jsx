import "./global.css"
import Header from "./components/Header"
import Home from "./pages/home"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="App">
      <Header />
      <Home/>
      <Footer/>
    </div>
  )
}

export default App
