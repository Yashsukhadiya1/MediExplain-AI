import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle2, Image as ImageIcon, FileCheck, Sparkles } from 'lucide-react';
import { formatFileSize } from '../../utils/reportUtils';
import { PulseLine } from '../common/PulseLine';

interface UploadZoneProps {
  onAnalyze: (file: File) => void;
  error?: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onAnalyze, error }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  const validateFile = (file: File) => {
    setLocalError(null);

    if (file.size > MAX_SIZE_BYTES) {
      setLocalError('Please upload a file smaller than 10 MB.');
      return;
    }

    const isExtensionValid = file.name.match(/\.(pdf|jpe?g|png)$/i);
    if (!ALLOWED_TYPES.includes(file.type) && !isExtensionValid) {
      setLocalError('Please upload a PDF, JPG, JPEG or PNG file.');
      return;
    }

    setSelectedFile(file);

    // Create preview if image
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setLocalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  const activeError = localError || error;

  return (
    <div className="relative mx-auto max-w-xl py-6 px-4">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-teal-400/20 to-cyan-400/20 blur-3xl pointer-events-none" />

      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 border border-teal-200/80 mb-3 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-teal-600" />
          <span>Instant Report Reader</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Let's understand your report
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Upload a laboratory or blood test report. We'll organize the results and explain the medical terms in plain language.
        </p>

        {/* Decorative micro pulse line */}
        <PulseLine variant="compact" className="mt-3" />
      </div>

      {/* Main Upload Box */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl shadow-teal-900/5 border border-white/90">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
        />

        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-300 ${
              isDragging
                ? 'border-teal-500 bg-teal-50/70 scale-[1.01] shadow-lg shadow-teal-500/10'
                : 'border-slate-300/90 hover:border-teal-500 hover:bg-teal-50/30'
            }`}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-50 to-cyan-50 text-teal-700 border border-teal-200/80 shadow-xs group-hover:scale-110 group-hover:shadow-md group-hover:shadow-teal-500/20 transition-all duration-300">
              <Upload className="h-6 w-6 animate-bounce" />
            </div>

            <h3 className="mt-5 text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
              Drop your report here
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              or browse from your device
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-700/20 hover:shadow-lg hover:shadow-teal-700/30 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <Upload className="h-3.5 w-3.5" />
              Choose file
            </button>

            <p className="mt-6 text-xs text-slate-400 font-medium">
              PDF, JPG, JPEG or PNG • Maximum 10 MB
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start justify-between rounded-xl border border-teal-100 bg-gradient-to-r from-teal-50/50 to-cyan-50/30 p-4.5">
              <div className="flex items-start gap-3.5 min-w-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Report preview"
                    className="h-16 w-16 rounded-xl object-cover border border-teal-200/80 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 to-cyan-600 text-white shadow-md shadow-teal-700/20">
                    {selectedFile.type.startsWith('image/') ? (
                      <ImageIcon className="h-6 w-6" />
                    ) : (
                      <FileText className="h-6 w-6" />
                    )}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Type: <span className="font-semibold text-slate-700">{selectedFile.type || 'Document'}</span> • Size: <span className="font-semibold text-slate-700">{formatFileSize(selectedFile.size)}</span>
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-teal-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" /> File selected & ready to analyze
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Remove file"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={handleAnalyzeClick}
                className="btn-shimmer flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/25 hover:shadow-xl hover:shadow-teal-700/35 hover:scale-[1.01] active:scale-95 transition-all duration-200"
              >
                <FileCheck className="h-4 w-4" />
                Analyze report
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {activeError && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-950 shadow-xs animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-amber-900">Notice</span>
              <span className="leading-relaxed block">{activeError}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
