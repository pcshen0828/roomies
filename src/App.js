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
  const uid = "fDtyceocFJwdyVakq25h";

  return (
    <BrowserRouter>
      <GlobalStyle></GlobalStyle>
      <Routes>
        <Route path="/" element={<Index uid={uid} />}></Route>
        <Route path="/about" element={<About uid={uid} />}></Route>
        <Route path="/apartments" element={<Apartments uid={uid} />}></Route>
        <Route
          path={`/apartment/:id`}
          element={<Apartment uid={uid} />}
        ></Route>
        <Route path="/groups" element={<Groups uid={uid} />}></Route>
        <Route path="/explore" element={<Explore uid={uid} />}></Route>
        <Route
          path="/member"
          element={isTenant ? <Tenant uid={uid} /> : <Landlord uid={uid} />}
        ></Route>
        <Route path="/messages" element={<Messages uid={uid} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
