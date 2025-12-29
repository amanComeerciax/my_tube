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
import AdminUploadAd from "./Pages/AdminUploadAd";
import RevenueDashboard from './Pages/RevenueDashboard';
import Shorts from "./Pages/Shorts";
import ShortUpload from './Pages/ShortUpload';
import LivePage from './Pages/LivePage';
import Subscriptions from './Pages/Subscriptions';
import LikedVideos from './Pages/LikedVideos';
import AdminMonetizationPanel from './Pages/AdminMonetizationPanel';
import CreatorMonetization from './Pages/CreatorMonetization';






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
<Route path="/admin/upload-ad" element={<AdminUploadAd />} />
<Route path="/revenue-dashboard" element={<RevenueDashboard />} />
<Route path="/shorts" element={<Shorts />} />
<Route path="/upload-short" element={<ShortUpload />} />
<Route path="/live/:roomId" element={<LivePage />} />
<Route path="/Subscription" element={<Subscriptions />} />
<Route path="/LikedVideos" element={<LikedVideos />} />
<Route path="/AdminMonetizationPanel" element={<AdminMonetizationPanel />} />
<Route path="/CreatorMonetization" element={<CreatorMonetization />} />



</Routes>   
</Router>
);
}


export default App;