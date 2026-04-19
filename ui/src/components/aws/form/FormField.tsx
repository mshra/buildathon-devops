import React, { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  required?: boolean;
  hint?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  children,
  required = false,
  hint
}) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm text-[#33FF00]/70 mb-1 flex items-center"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {hint && (
        <p className="mt-1 text-xs text-[#33FF00]/50">{hint}</p>
      )}
    </div>
  );
};

export default FormField;