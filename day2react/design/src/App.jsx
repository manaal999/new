import CarView from "./Cars/CarView"
import CarList from "./Cars/CarsList"
import CarCreate from "./Cars/CarsCreate"
import {BrowserRouter,Routes,Route} from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="" element={<CarsList/>}/>
            <Route path="/car/list" element={<CarsList/>}/>
            <Route path="/car/create" element={<CarsCreate/>}/>
            <Route path="/car/view" element={<CarView/>}/>
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App