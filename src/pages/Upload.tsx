import React from 'react';
import { UploadZone } from '../components/upload/UploadZone';
import { AnalysisLoader } from '../components/analysis/AnalysisLoader';
import { Disclaimer } from '../components/common/Disclaimer';

interface UploadProps {
  isAnalyzing: boolean;
  analyzingFileName: string;
  onAnalyzeFile: (file: File) => void;
  error?: string | null;
}

export const Upload: React.FC<UploadProps> = ({
  isAnalyzing,
  analyzingFileName,
  onAnalyzeFile,
  error,
}) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {isAnalyzing ? (
        <AnalysisLoader fileName={analyzingFileName} />
      ) : (
        <div className="space-y-8">
          <UploadZone onAnalyze={onAnalyzeFile} error={error} />
          <Disclaimer compact className="max-w-2xl mx-auto" />
        </div>
      )}
    </div>
  );
};
