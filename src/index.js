import React  from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInSide from "./components/App"; 
import Home from "./components/Home"; 
import Admin from "./components/Admin"; 
import Denied from "./components/Denied"; 


export default function Uygulama() {
  let role=localStorage.getItem("role");
  let token = localStorage.getItem("token");
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/"  element={ <SignInSide />}/>  
           <Route path="home" element={token==null?<SignInSide />:<Home />} />
           <Route path="admin" element={token==null?<SignInSide />:role=="Admin"? <Admin />:<Denied />} />
           <Route path="denied" element={<Denied />} />
        </Routes>
      </BrowserRouter>
    );
  }

ReactDOM.render(<Uygulama/>,document.getElementById('root'));


