import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Review from "./pages/Review";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CourseOverview from './pages/course/CourseOverview';
import CourseItemPage from './pages/course/CourseItemPage';
import CourseGrades from './pages/course/CourseGrades';
import CourseDiscussions from './pages/course/CourseDiscussions';

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/review" element={<Review />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* Course (Coursera-like) */}
          <Route path="/course/:id" element={<CourseOverview />} />
          <Route path="/course/:id/lesson/:itemId" element={<CourseItemPage />} />
          <Route path="/course/:id/grades" element={<CourseGrades />} />
          <Route path="/course/:id/discussions" element={<CourseDiscussions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
