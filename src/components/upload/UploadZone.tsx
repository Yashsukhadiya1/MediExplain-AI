import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle2, Image as ImageIcon, FileCheck } from 'lucide-react';
import { formatFileSize } from '../../utils/reportUtils';

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
    <div className="mx-auto max-w-xl py-4">
      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Let's understand your report
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Upload a laboratory or blood test report. We'll organize the results and explain the medical terms in plain language.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
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
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
              isDragging
                ? 'border-teal-800 bg-teal-50/50'
                : 'border-slate-300 hover:border-teal-700 hover:bg-slate-50/60'
            }`}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-800">
              <Upload className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              Drop your report here
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              or choose a file
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-4 inline-flex items-center rounded-lg bg-teal-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-900 transition-colors"
            >
              Choose file
            </button>

            <p className="mt-6 text-xs text-slate-400 font-medium">
              PDF, JPG, JPEG or PNG • Maximum 10 MB
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-start gap-3.5 min-w-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Report preview"
                    className="h-14 w-14 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-800 text-white">
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
                    Type: <span className="font-medium text-slate-700">{selectedFile.type || 'Document'}</span> • Size: <span className="font-medium text-slate-700">{formatFileSize(selectedFile.size)}</span>
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-teal-800">
                    <CheckCircle2 className="h-3.5 w-3.5" /> File selected & ready
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="rounded-md p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
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
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={handleAnalyzeClick}
                className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg bg-teal-800 py-3 text-sm font-semibold text-white shadow-xs hover:bg-teal-900 transition-colors"
              >
                <FileCheck className="h-4 w-4" />
                Analyze report
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {activeError && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
            <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold block">Notice</span>
              <span>{activeError}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
