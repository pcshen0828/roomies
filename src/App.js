import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/GlobalStyle";
import Header from "./components/layout/Header";
import Index from "./pages/Index";
import Apartments from "./pages/Apartments";
import Apartment from "./pages/Apartment";
import Groups from "./pages/Groups";
import User from "./pages/Users";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import PageNotFound from "./pages/NotFound";
import Community from "./pages/Community";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import "react-loading-skeleton/dist/skeleton.css";

import "./styles/carousel.css";
import "./styles/customCalendar.css";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle></GlobalStyle>
      <Header />
      <Routes>
        <Route path="/" element={<Index />}></Route>
        <Route path="/apartments" element={<Apartments />}></Route>
        <Route path={`/apartment/:id`} element={<Apartment />}></Route>
        <Route path="/groups/:id" element={<Groups />}></Route>
        <Route path="/users/:id" element={<User />}></Route>
        <Route path="/community" element={<Community />}></Route>
        <Route path="/explore" element={<Explore />}></Route>
        <Route path="/profile/:id/:status" element={<Profile />}></Route>
        <Route path="/messages/:id" element={<Messages />}></Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
