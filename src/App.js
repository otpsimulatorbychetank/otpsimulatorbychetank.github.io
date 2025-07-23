import { Routes, Route } from 'react-router-dom';
import GenerateOtp from './pages/GenerateOtp';
import Success from './pages/Success';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Admin from './pages/Admin';
import UnlockUser from './pages/UnlockUser';

function App() {
  return (
    <GoogleOAuthProvider clientId="1000351801324-t19mpl60tue3qalrskb07s8kr42k7fm7.apps.googleusercontent.com">
    <Routes>
        <Route path="/generateotp" element={<GenerateOtp />} />
        <Route path="/success" element={<Success />} />
        <Route path="/" element={<Admin />} />
        <Route path="/unlockuser" element={<UnlockUser />} />
    </Routes>
 </GoogleOAuthProvider>

  );
}

export default App;
