import React from 'react';
import FormField from './FormField';

interface KeyPair {
  value: string;
  label: string;
}

interface KeyPairSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const KEY_PAIRS: KeyPair[] = [
  { value: 'key-12345', label: 'dev-keypair' },
  { value: 'key-23456', label: 'prod-keypair' },
  { value: 'key-34567', label: 'personal-keypair' },
  { value: 'key-45678', label: 'team-keypair' },
  { value: 'key-56789', label: 'backup-keypair' },
];

const KeyPairSelect: React.FC<KeyPairSelectProps> = ({
  value,
  onChange,
  required = false
}) => {
  return (
    <FormField 
      id="keyPair" 
      label="Key Pair" 
      required={required}
      hint="SSH key for secure access to your instance"
    >
      <select
        id="keyPair"
        name="keyPair"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#111] border border-[#33FF00]/30 text-[#33FF00] rounded-sm p-2 text-sm"
        required={required}
      >
        <option value="">Select a key pair</option>
        {KEY_PAIRS.map((keyPair) => (
          <option key={keyPair.value} value={keyPair.value}>
            {keyPair.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export default KeyPairSelect;