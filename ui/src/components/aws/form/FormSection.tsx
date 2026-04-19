import React, { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => {
  return (
    <div className="space-y-4">
      <div className="border-b border-[#33FF00]/20 pb-2">
        <h4 className="text-sm uppercase tracking-wider text-[#33FF00]">{title}</h4>
        {description && (
          <p className="text-xs text-[#33FF00]/70 mt-1">{description}</p>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;