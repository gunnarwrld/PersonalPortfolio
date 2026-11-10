import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index.tsx";

// NotFound is rarely visited - lazy-load to keep it out of the main bundle
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </>
  );
};

export default App;
