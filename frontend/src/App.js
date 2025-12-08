import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import Watch from './Pages/Watch';
import Upload from './Pages/Upload';
import UserUpload from './Pages/UserUpload';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Profile from './Pages/Profile';
import History from './Pages/History';





function App(){
return (
<Router>
<Routes>
<Route path="/" element={<Home/>} />
<Route path="/watch/:filename" element={<Watch />} />
<Route path="/Login" element={<Login/>}/>
<Route path="/Signup" element={<Signup/>}/>
<Route path="/upload" element={<Upload/>} />
<Route path="/UserUpload" element={<UserUpload/>} />
<Route path="/Profile" element={<Profile/>} />
<Route path="/history" element={<History />} />

</Routes>
</Router>
);
}


export default App;