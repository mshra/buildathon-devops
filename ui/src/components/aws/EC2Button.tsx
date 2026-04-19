import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Server } from 'lucide-react';

const EC2Button: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline" 
      className="w-full border border-[#33FF00]/30 p-2 bg-black/50 flex justify-center items-center text-[#33FF00] hover:bg-[#111] transition-colors"
      onClick={() => navigate('/ec2')}
    >
      <Server size={16} className="mr-2" />
      OPEN EC2 DASHBOARD
    </Button>
  );
};

export default EC2Button;