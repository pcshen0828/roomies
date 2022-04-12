import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/GlobalStyle";
import Index from "./pages/Index";
import About from "./pages/About";
import Apartments from "./pages/Apartments";
import Apartment from "./pages/Apartment";
import Groups from "./pages/Groups";
import Explore from "./pages/Explore";
import { Tenant, Landlord } from "./pages/Member";
import Messages from "./pages/Messages";

function App() {
  // fix me
  let isTenant = true;

  return (
    <BrowserRouter>
      <GlobalStyle></GlobalStyle>
      <Routes>
        <Route path="/" element={<Index />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/apartments" element={<Apartments />}></Route>
        <Route path={`/apartment/:id`} element={<Apartment />}></Route>
        <Route path="/groups/:id" element={<Groups />}></Route>
        <Route path="/explore" element={<Explore />}></Route>
        <Route
          path="/member"
          element={isTenant ? <Tenant /> : <Landlord />}
        ></Route>
        <Route path="/messages" element={<Messages />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
