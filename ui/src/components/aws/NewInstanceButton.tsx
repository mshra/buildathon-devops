import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewInstanceButtonProps {
  onClick: () => void;
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
}

const NewInstanceButton: React.FC<NewInstanceButtonProps> = ({ 
  onClick, 
  size = 'default',
  fullWidth = false
}) => {
  return (
    <Button 
      variant="outline" 
      size={size}
      className={cn(
        "border-[#33FF00]/50 text-[#33FF00] hover:bg-[#33FF00]/20",
        fullWidth && "w-full"
      )}
      onClick={onClick}
    >
      <PlusCircle size={size === 'sm' ? 16 : 18} className="mr-2" />
      New Instance
    </Button>
  );
};

export default NewInstanceButton;