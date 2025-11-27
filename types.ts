import React from 'react';

export interface AttackType {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  example?: string;
  severity: 'critical' | 'high' | 'medium';
}

export interface ScenarioData {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  attackTypes: AttackType[];
  realCase: {
    name: string;
    year: string;
    description: string;
    loss: string;
  };
  vulnerableCode: string;
  component: React.FC;
}

export interface SimulationProps {
  isActive: boolean;
}