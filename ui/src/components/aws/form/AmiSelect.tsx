import React from 'react';
import FormField from './FormField';

interface AMI {
  value: string;
  label: string;
  description?: string;
}

interface AmiSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const AMIS: AMI[] = [
  { 
    value: 'ami-12345', 
    label: 'Amazon Linux 2 AMI', 
    description: 'Linux kernel 5.10, AWS optimized' 
  },
  { 
    value: 'ami-23456', 
    label: 'Ubuntu Server 20.04 LTS', 
    description: 'Focal Fossa, HVM, EBS-backed' 
  },
  { 
    value: 'ami-34567', 
    label: 'Red Hat Enterprise Linux 8', 
    description: 'RHEL 8, HVM, EBS-backed' 
  },
  { 
    value: 'ami-45678', 
    label: 'Windows Server 2019', 
    description: 'Base installation, English' 
  },
  { 
    value: 'ami-56789', 
    label: 'Amazon Linux 2023 AMI', 
    description: 'Latest version with enhanced security' 
  },
  { 
    value: 'ami-67890', 
    label: 'Ubuntu Server 22.04 LTS', 
    description: 'Jammy Jellyfish, HVM, EBS-backed' 
  },
];

const AmiSelect: React.FC<AmiSelectProps> = ({
  value,
  onChange,
  required = false
}) => {
  return (
    <FormField 
      id="image" 
      label="Amazon Machine Image (AMI)" 
      required={required}
      hint="The operating system image to use for your instance"
    >
      <select
        id="image"
        name="image"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#111] border border-[#33FF00]/30 text-[#33FF00] rounded-sm p-2 text-sm"
        required={required}
      >
        {AMIS.map((ami) => (
          <option key={ami.value} value={ami.value}>
            {ami.label} - {ami.description}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export default AmiSelect;