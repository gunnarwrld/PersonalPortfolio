import { lazy, Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PagePreloader from "@/components/PagePreloader";

// NotFound is rarely visited — lazy-load to keep it out of the main bundle
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

// Show the preloader only on the very first visit per session
const hasVisited = sessionStorage.getItem("visited") === "true";

const App = () => {
  const [showPreloader, setShowPreloader] = useState(!hasVisited);

  useEffect(() => {
    if (!hasVisited) {
      sessionStorage.setItem("visited", "true");
      // Stairs animation: STEPS * 0.07 delay + 0.55 duration = ~0.9 s total
      const id = setTimeout(() => setShowPreloader(false), 950);
      return () => clearTimeout(id);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PagePreloader isVisible={showPreloader} />
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
