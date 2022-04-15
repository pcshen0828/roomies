import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/GlobalStyle";
import Index from "./pages/Index";
import About from "./pages/About";
import Apartments from "./pages/Apartments";
import Apartment from "./pages/Apartment";
import Groups from "./pages/Groups";
import User from "./pages/Users";
import Explore from "./pages/Explore";
import { Tenant, Landlord } from "./pages/Profile";
import Messages from "./pages/Messages";
import userContext from "./context/userContext";

function App() {
  const context = React.useContext(userContext);

  return (
    <BrowserRouter>
      <GlobalStyle></GlobalStyle>
      <Routes>
        <Route path="/" element={<Index />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/apartments" element={<Apartments />}></Route>
        <Route path={`/apartment/:id`} element={<Apartment />}></Route>
        <Route path="/groups/:id" element={<Groups />}></Route>
        <Route path="/users/:id" element={<User />}></Route>
        <Route path="/explore" element={<Explore />}></Route>
        <Route
          path="/profile"
          element={context.role === 1 ? <Tenant /> : <Landlord />}
        ></Route>
        <Route path="/messages" element={<Messages />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
