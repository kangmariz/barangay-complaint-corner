
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import * as Pages from '@/pages';
import { AuthProvider } from '@/context/AuthContext';
import { ComplaintProvider } from '@/context/ComplaintContext';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ComplaintProvider>
          <Routes>
            <Route path="/" element={<Pages.Index />} />
            <Route path="/home" element={<Pages.HomePage />} />
            <Route path="/login" element={<Pages.LoginPage />} />
            <Route path="/signup" element={<Pages.SignupPage />} />
            <Route path="/dashboard" element={<Pages.AdminDashboardPage />} />
            <Route path="/my-complaints" element={<Pages.MyComplaintsPage />} />
            <Route path="/edit-complaint/:id" element={<Pages.EditComplaintPage />} />
            <Route path="/submit-complaint" element={<Pages.SubmitComplaintPage />} />
            <Route path="/complaints" element={<Pages.ComplaintsPage />} />
            <Route path="/profile" element={<Pages.ProfilePage />} />
            <Route path="*" element={<Pages.NotFound />} />
          </Routes>
          <Toaster />
        </ComplaintProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
