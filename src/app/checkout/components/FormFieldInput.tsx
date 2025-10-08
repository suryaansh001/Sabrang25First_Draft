import React, { useState } from 'react';
import { FormField } from '../types';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

interface FormFieldInputProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  error?: string;
}

export function FormFieldInput({ field, value, onChange, onFileChange, error }: FormFieldInputProps) {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onFileChange(file);

    // Generate preview for images
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    onFileChange(null);
  };

  const renderInput = () => {
    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2.5 glass border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-white transition-colors"
            required={field.required}
          >
            <option value="" className="bg-gray-900">Select {field.label}</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-gray-900">
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="file"
              accept={field.accept}
              onChange={handleFileInput}
              className="hidden"
              id={`file-${field.name}`}
              required={field.required}
            />
            {!selectedFile ? (
              <label
                htmlFor={`file-${field.name}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 glass border border-white/20 rounded-lg cursor-pointer hover:border-purple-400 transition-colors group"
              >
                <Upload className="w-5 h-5 text-purple-300 group-hover:text-purple-200" />
                <span className="text-sm text-white/70 group-hover:text-white">Choose file</span>
              </label>
            ) : (
              <div className="glass border border-purple-400/40 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  {filePreview ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/20">
                      <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 border border-purple-400/40">
                      <FileText className="w-8 h-8 text-purple-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{selectedFile.name}</p>
                    <p className="text-xs text-white/60 mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'phone':
        return (
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={10}
            pattern="[0-9]{10}"
            className="w-full px-4 py-2.5 glass border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-white placeholder:text-white/40 transition-colors"
            required={field.required}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-2.5 glass border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-white placeholder:text-white/40 transition-colors"
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-2.5 glass border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-white placeholder:text-white/40 transition-colors"
            required={field.required}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.inputProps?.maxLength}
            className="w-full px-4 py-2.5 glass border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-white placeholder:text-white/40 transition-colors"
            required={field.required}
          />
        );
    }
  };

  return (
    <div className={field.type === 'file' ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium mb-2 text-white/90">
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className={error ? 'ring-2 ring-red-500/50 rounded-lg' : ''}>
        {renderInput()}
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-2 text-red-400 text-sm animate-pulse">
          <span className="text-lg">⚠️</span>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
