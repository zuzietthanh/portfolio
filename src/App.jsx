import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from '@/lib/PageNotFound';
import ScrollToTop from '@/components/ScrollToTop';
import Home from '@/pages/Home';
import ProjectDetail from '@/pages/ProjectDetail';
import StatementOfPurpose from '@/pages/StatementOfPurpose';
import DocumentDetail from '@/pages/DocumentDetail';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/statement-of-purpose" element={<StatementOfPurpose />} />
        <Route path="/document/:id" element={<DocumentDetail />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
