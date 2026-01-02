// src/components/components.tsx
import React from 'react';

export const TextInput = ({ 
  placeholder, 
  value, 
  onChange,
  fullWidth = true,
}: { 
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
}) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    style={{
      width: fullWidth ? '100%' : 'auto',
      padding: '10px 14px',
      backgroundColor: '#1A1A1A',
      border: '1px solid #444',
      borderRadius: '8px',
      color: '#FFFFFF',
      fontSize: '13px',
      outline: 'none',
      transition: 'all 0.2s'
    }}
  />
);

export const Select = ({
  options,
  value,
  onChange,
  placeholder
}: {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    style={{
      width: '100%',
      padding: '10px 14px',
      backgroundColor: '#1A1A1A',
      border: '1px solid #444',
      borderRadius: '8px',
      color: '#FFFFFF',
      fontSize: '13px',
      outline: 'none'
    }}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
