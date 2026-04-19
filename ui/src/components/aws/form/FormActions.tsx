import React, { ReactNode } from 'react';

interface FormActionsProps {
  children: ReactNode;
}

const FormActions: React.FC<FormActionsProps> = ({ children }) => {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t border-[#33FF00]/30">
      {children}
    </div>
  );
};

export default FormActions;