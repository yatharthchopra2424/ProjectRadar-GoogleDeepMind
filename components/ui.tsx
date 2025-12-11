import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  isLoading, 
  disabled, 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-teal-600 text-white hover:bg-teal-700 shadow-sm",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], (disabled || isLoading) && "opacity-50 cursor-not-allowed", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>}
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title }) => {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", className)}>
      {title && <div className="px-6 py-4 border-b border-slate-100 font-semibold text-lg text-slate-800">{title}</div>}
      <div className="p-6">{children}</div>
    </div>
  );
};

interface FileUploadProps {
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, accept = "image/*,application/pdf" }) => {
  const [fileName, setFileName] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onChange(file);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer">
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleFileChange}
          accept={accept}
        />
        <div className="text-slate-500">
          {fileName ? (
            <span className="text-indigo-600 font-medium">{fileName}</span>
          ) : (
            <>
              <p className="font-medium text-indigo-600">Click to upload</p>
              <p className="text-xs mt-1">or drag and drop</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
