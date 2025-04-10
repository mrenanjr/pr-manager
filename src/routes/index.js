import { Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const CustomRoutes = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/repositories/:repository*" element={<Repository />} />
    </Routes>
  );
}

export default CustomRoutes;
