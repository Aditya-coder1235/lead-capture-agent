import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LeadForm from "./pages/LeadForm";
import AdminPanel from "./pages/AdminPanel";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LeadForm />} />
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
