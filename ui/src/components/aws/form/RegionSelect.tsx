import React from 'react';
import FormField from './FormField';

interface Region {
  value: string;
  label: string;
}

interface RegionSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const REGIONS: Region[] = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'ca-central-1', label: 'Canada (Central)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' },
  { value: 'eu-west-2', label: 'EU (London)' },
  { value: 'eu-west-3', label: 'EU (Paris)' },
  { value: 'eu-central-1', label: 'EU (Frankfurt)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
  { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
  { value: 'sa-east-1', label: 'South America (São Paulo)' },
];

const RegionSelect: React.FC<RegionSelectProps> = ({
  value,
  onChange,
  required = false
}) => {
  return (
    <FormField id="region" label="Region" required={required}>
      <select
        id="region"
        name="region"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#111] border border-[#33FF00]/30 text-[#33FF00] rounded-sm p-2 text-sm"
        required={required}
      >
        {REGIONS.map((region) => (
          <option key={region.value} value={region.value}>
            {region.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export default RegionSelect;