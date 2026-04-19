import React from 'react';
import FormField from './FormField';

interface InstanceType {
  value: string;
  label: string;
  description?: string;
}

interface InstanceTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const INSTANCE_TYPES: InstanceType[] = [
  { value: 't2.micro', label: 't2.micro', description: '1 vCPU, 1 GiB RAM' },
  { value: 't2.small', label: 't2.small', description: '1 vCPU, 2 GiB RAM' },
  { value: 't2.medium', label: 't2.medium', description: '2 vCPU, 4 GiB RAM' },
  { value: 't3.micro', label: 't3.micro', description: '2 vCPU, 1 GiB RAM' },
  { value: 't3.small', label: 't3.small', description: '2 vCPU, 2 GiB RAM' },
  { value: 'm5.large', label: 'm5.large', description: '2 vCPU, 8 GiB RAM' },
  { value: 'c5.large', label: 'c5.large', description: '2 vCPU, 4 GiB RAM, Compute Optimized' },
  { value: 'r5.large', label: 'r5.large', description: '2 vCPU, 16 GiB RAM, Memory Optimized' },
];

const InstanceTypeSelect: React.FC<InstanceTypeSelectProps> = ({
  value,
  onChange,
  required = false
}) => {
  return (
    <FormField id="instanceType" label="Instance Type" required={required}>
      <select
        id="instanceType"
        name="instanceType"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#111] border border-[#33FF00]/30 text-[#33FF00] rounded-sm p-2 text-sm"
        required={required}
      >
        {INSTANCE_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label} ({type.description})
          </option>
        ))}
      </select>
    </FormField>
  );
};

export default InstanceTypeSelect;