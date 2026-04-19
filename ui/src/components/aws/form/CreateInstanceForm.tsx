import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { createInstance } from '@/services/ec2Service';
import { useToast } from '@/hooks/use-toast';
import {
  FormContainer,
  FormSection,
  FormActions,
  FormButton,
  TextInput,
  InstanceTypeSelect,
  RegionSelect,
  AmiSelect,
  SecurityGroupSelect,
  KeyPairSelect
} from './';

export interface InstanceFormData {
  name: string;
  instanceType: string;
  region: string;
  image: string;
  keyPair: string;
  securityGroup: string;
  userData?: string;
  tags?: Record<string, string>;
}

interface CreateInstanceFormProps {
  onSubmit: (data: InstanceFormData) => void;
  onCancel: () => void;
}

const CreateInstanceForm: React.FC<CreateInstanceFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InstanceFormData>({
    name: '',
    instanceType: 't2.micro',
    region: 'us-east-1',
    image: 'ami-12345',
    keyPair: '',
    securityGroup: '',
    userData: '',
    tags: { Name: '' }
  });
  
  const handleChange = <K extends keyof InstanceFormData>(key: K, value: InstanceFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Special case for name field - also update the Name tag
    if (key === 'name') {
      setFormData(prev => ({
        ...prev,
        tags: { ...prev.tags, Name: value as string }
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, we would call the API to create the instance
      // const response = await createInstance(formData);
      
      toast({
        title: 'Instance creation initiated',
        description: `Creating instance ${formData.name} in ${formData.region}`,
      });
      
      onSubmit(formData);
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Failed to create instance',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer title="Create EC2 Instance" onSubmit={handleSubmit}>
      <FormSection 
        title="Basic Configuration" 
        description="Configure the basic settings for your EC2 instance"
      >
        <TextInput
          id="name"
          label="Instance Name"
          value={formData.name}
          onChange={(value) => handleChange('name', value)}
          placeholder="my-ec2-instance"
          required
          hint="A name to help identify this instance"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InstanceTypeSelect
            value={formData.instanceType}
            onChange={(value) => handleChange('instanceType', value)}
            required
          />
          
          <RegionSelect
            value={formData.region}
            onChange={(value) => handleChange('region', value)}
            required
          />
        </div>
        
        <AmiSelect
          value={formData.image}
          onChange={(value) => handleChange('image', value)}
          required
        />
      </FormSection>
      
      <FormSection 
        title="Security" 
        description="Configure security settings for your instance"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KeyPairSelect
            value={formData.keyPair}
            onChange={(value) => handleChange('keyPair', value)}
          />
          
          <SecurityGroupSelect
            value={formData.securityGroup}
            onChange={(value) => handleChange('securityGroup', value)}
          />
        </div>
      </FormSection>
      
      <FormSection 
        title="Advanced Configuration" 
        description="Optional advanced settings"
      >
        <TextInput
          id="userData"
          label="User Data"
          value={formData.userData || ''}
          onChange={(value) => handleChange('userData', value)}
          placeholder="#!/bin/bash&#10;echo 'Hello World'"
          hint="Startup script that runs when the instance launches"
        />
      </FormSection>
      
      <FormActions>
        <FormButton
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-red-500/50 text-red-500 hover:bg-red-950"
          icon={X}
          disabled={isSubmitting}
        >
          Cancel
        </FormButton>
        
        <FormButton
          type="submit"
          variant="outline"
          className="border-[#33FF00]/50 text-[#33FF00] hover:bg-[#33FF00]/20"
          icon={Check}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Instance'}
        </FormButton>
      </FormActions>
    </FormContainer>
  );
};

export default CreateInstanceForm;