import React, { ReactNode } from 'react';

interface FormContainerProps {
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

const FormContainer: React.FC<FormContainerProps> = ({ title, children, onSubmit }) => {
  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <h3 className="text-md uppercase tracking-wider border-b border-[#33FF00]/30 pb-2 mb-4 text-[#33FF00]">
        {title}
      </h3>
      
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
      </form>
    </div>
  );
};

export default FormContainer;