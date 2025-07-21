import { Routes, Route } from 'react-router-dom';
import GenerateOtp from './pages/GenerateOtp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<GenerateOtp />} />
    </Routes>
  );
}

export default App;
