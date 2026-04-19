import React from 'react';
import FormField from './FormField';

interface SecurityGroup {
  value: string;
  label: string;
  description?: string;
}

interface SecurityGroupSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const SECURITY_GROUPS: SecurityGroup[] = [
  { 
    value: 'sg-12345', 
    label: 'default', 
    description: 'Default security group' 
  },
  { 
    value: 'sg-23456', 
    label: 'web-server', 
    description: 'Allow HTTP/HTTPS traffic' 
  },
  { 
    value: 'sg-34567', 
    label: 'ssh-only', 
    description: 'Allow SSH access only' 
  },
  { 
    value: 'sg-45678', 
    label: 'database', 
    description: 'Allow database ports' 
  },
  { 
    value: 'sg-56789', 
    label: 'internal-only', 
    description: 'No public internet access' 
  },
];

const SecurityGroupSelect: React.FC<SecurityGroupSelectProps> = ({
  value,
  onChange,
  required = false
}) => {
  return (
    <FormField 
      id="securityGroup" 
      label="Security Group" 
      required={required}
      hint="Controls inbound and outbound traffic for your instance"
    >
      <select
        id="securityGroup"
        name="securityGroup"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#111] border border-[#33FF00]/30 text-[#33FF00] rounded-sm p-2 text-sm"
        required={required}
      >
        <option value="">Select a security group</option>
        {SECURITY_GROUPS.map((group) => (
          <option key={group.value} value={group.value}>
            {group.label} - {group.description}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export default SecurityGroupSelect;