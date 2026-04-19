import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InstanceList from '../components/InstanceList';
import { Instance } from '../services/ec2Service';

describe('InstanceList Component', () => {
  it('renders instances correctly', () => {
    const instances: Instance[] = [
      { id: 'i-1234', state: 'running' },
      { id: 'i-5678', state: 'stopped' }
    ];
    
    render(<InstanceList instances={instances} />);
    
    expect(screen.getByText('i-1234')).toBeInTheDocument();
    expect(screen.getByText('running')).toBeInTheDocument();
    expect(screen.getByText('i-5678')).toBeInTheDocument();
    expect(screen.getByText('stopped')).toBeInTheDocument();
  });

  it('displays a message when no instances are found', () => {
    render(<InstanceList instances={[]} />);
    expect(screen.getByText('No instances found')).toBeInTheDocument();
  });

  it('calls onSelect when an instance is clicked', () => {
    const instances: Instance[] = [
      { id: 'i-1234', state: 'running' }
    ];
    
    const handleSelect = vi.fn();
    
    render(<InstanceList instances={instances} onSelect={handleSelect} />);
    
    fireEvent.click(screen.getByText('i-1234'));
    
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(instances[0]);
  });
});