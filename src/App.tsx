import React, { useState } from 'react';
import { PageView, ReportData } from './types/report';
import { analyzeReport } from './services/reportService';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { Upload } from './pages/Upload';
import { Results } from './pages/Results';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingFileName, setAnalyzingFileName] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    setUploadError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyzeFile = async (file: File) => {
    setUploadError(null);
    setIsAnalyzing(true);
    setAnalyzingFileName(file.name);

    try {
      const report = await analyzeReport(file);
      setCurrentReport(report);
      setIsAnalyzing(false);
      setCurrentPage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setIsAnalyzing(false);
      setUploadError(err.message || 'Unable to process this medical report.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 medical-mesh-bg font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenHowItWorks={() => {
          const el = document.getElementById('how-it-works');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAbout={() => {
          const el = document.getElementById('how-it-works');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home onNavigateToUpload={() => handleNavigate('upload')} />
        )}

        {currentPage === 'upload' && (
          <Upload
            isAnalyzing={isAnalyzing}
            analyzingFileName={analyzingFileName}
            onAnalyzeFile={handleAnalyzeFile}
            error={uploadError}
          />
        )}

        {currentPage === 'results' && (
          <Results
            report={currentReport}
            onAnalyzeAnother={() => handleNavigate('upload')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenHowItWorks={() => {
          if (currentPage !== 'home') setCurrentPage('home');
          setTimeout(() => {
            const el = document.getElementById('how-it-works');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenAbout={() => {
          if (currentPage !== 'home') setCurrentPage('home');
          setTimeout(() => {
            const el = document.getElementById('how-it-works');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />
    </div>
  );
};

export default App;
