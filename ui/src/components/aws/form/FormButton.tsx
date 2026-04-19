import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
}

const FormButton: React.FC<FormButtonProps> = ({
  children,
  type = 'button',
  variant = 'default',
  className,
  onClick,
  disabled = false,
  icon: Icon
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={cn(className)}
    >
      {Icon && <Icon size={16} className="mr-2" />}
      {children}
    </Button>
  );
};

export default FormButton;