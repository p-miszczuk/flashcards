import { Routes, Route } from 'react-router-dom';
import GroupsPage from './pages/GroupsPage';
import CardsPage from './pages/CardsPage';

const App = () => (
  <div className="min-h-screen bg-slate-50">
    <Routes>
      <Route path="/" element={<GroupsPage />} />
      <Route path="/groups/:id" element={<CardsPage />} />
    </Routes>
  </div>
);

export default App;
