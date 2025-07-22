import { Routes, Route } from 'react-router-dom';
import GenerateOtp from './pages/GenerateOtp';
import Success from './pages/Success';

function App() {
  return (
    <Routes>
      <Route path="/" element={<GenerateOtp />} />
        <Route path="/success" element={<Success />} />
    </Routes>
  );
}

export default App;
