import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "~/components/Layout";
import HomePage from "~/pages/HomePage";
import RecordPage from "~/pages/RecordPage";
import BrowsePage from "~/pages/BrowsePage";
import NavigatePage from "~/pages/NavigatePage";
import LandmarkDetailPage from "~/pages/LandmarkDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/browse/:id" element={<LandmarkDetailPage />} />
        <Route path="/navigate" element={<NavigatePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}