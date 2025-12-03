import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import Watch from './Pages/Watch';
import Upload from './Pages/Upload';
import Login from './Pages/Login';



function App(){
return (
<Router>
<Routes>
<Route path="/" element={<Home/>} />
<Route path="/watch/:filename" element={<Watch />} />
<Route path="/Login" element={<Login/>}/>
<Route path="/upload" element={<Upload/>} />
</Routes>
</Router>
);
}


export default App;