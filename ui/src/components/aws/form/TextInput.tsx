import React from 'react';
import FormField from './FormField';
import { Input } from '@/components/ui/input';

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  multiline?: boolean;
  rows?: number;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  hint,
  type = 'text',
  multiline = false,
  rows = 3
}) => {
  return (
    <FormField id={id} label={label} required={required} hint={hint}>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-[#111] border-[#33FF00]/30 text-[#33FF00] rounded-sm p-2 text-sm resize-none"
          required={required}
        />
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-[#111] border-[#33FF00]/30 text-[#33FF00]"
          required={required}
        />
      )}
    </FormField>
  );
};

export default TextInput;