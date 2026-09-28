import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PagePreloader from "@/components/PagePreloader";
import CustomCursor from "@/components/CustomCursor";

// NotFound is rarely visited - lazy-load to keep it out of the main bundle
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => {
  // Read sessionStorage inside the component so it is safe in jsdom / SSR
  const alreadyVisited = useRef(
    typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("visited") === "true",
  );
  const [showPreloader, setShowPreloader] = useState(!alreadyVisited.current);

  useEffect(() => {
    if (!alreadyVisited.current) {
      sessionStorage.setItem("visited", "true");
      // Stairs animation: (STEPS-1)*0.07 delay + 0.55 duration ~= 0.83 s
      const id = setTimeout(() => setShowPreloader(false), 950);
      return () => clearTimeout(id);
    }
  // alreadyVisited.current is a ref - stable across renders, no dep needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />
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
