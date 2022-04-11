import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/GlobalStyle";
import Index from "./routes/Index";
import About from "./routes/About";
import Apartments from "./routes/Apartments";
import Groups from "./routes/Groups";
import Explore from "./routes/Explore";
import {Tenant, Landlord} from "./routes/Member";
import Messages from "./routes/Messages";

function App() {
  let isTenant = true;
  return (
    <BrowserRouter>
      <GlobalStyle></GlobalStyle>
      <Routes>
        <Route path="/" element={<Index/>}></Route>
        <Route path="/about" element={<About/>}></Route>
        <Route path="/apartments" element={<Apartments/>}></Route>
        <Route path="/groups" element={<Groups/>}></Route>
        <Route path="/explore" element={<Explore/>}></Route>
        <Route path="/member" element={isTenant ? <Tenant/> : <Landlord/>}></Route>
        <Route path="/messages" element={<Messages/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
