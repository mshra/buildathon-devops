import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
  active?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ 
  icon: Icon, 
  label, 
  onClick,
  className,
  active = false
}) => {
  return (
    <button 
      className={cn(
        "bg-[#111] border border-[#33FF00]/30 p-2 rounded-sm flex flex-col items-center justify-center hover:bg-[#222] transition-colors group",
        active && "bg-[#222] border-[#33FF00]/60",
        className
      )}
      onClick={onClick}
      aria-label={label}
    >
      <Icon className={cn(
        "h-4 w-4 md:h-5 md:w-5 text-[#33FF00]/70 group-hover:text-[#33FF00]",
        active && "text-[#33FF00]"
      )} />
      <span className={cn(
        "text-[#33FF00]/70 font-micro text-[8px] md:text-xs mt-1 group-hover:text-[#33FF00]",
        active && "text-[#33FF00]"
      )}>
        {label}
      </span>
    </button>
  );
};

export default NavButton;
