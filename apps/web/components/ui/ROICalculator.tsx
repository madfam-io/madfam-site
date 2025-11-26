'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { cn } from './utils';

export interface ROIResults {
  savings: number;
  roi: number;
  paybackMonths: number;
  timeReduction: number;
}

interface ROICalculatorProps {
  title?: string;
  description?: string;
  className?: string;
  serviceTier?: string;
  onCalculate?: (results: ROIResults) => void;
}

export function ROICalculator({
  title = 'ROI Calculator',
  description = 'Estimate your potential return on investment',
  className,
  serviceTier: _serviceTier,
  onCalculate,
}: ROICalculatorProps) {
  const [inputs, setInputs] = useState({
    currentCost: 10000,
    hoursPerWeek: 40,
    teamSize: 5,
  });
  const [results, setResults] = useState<ROIResults | null>(null);

  const handleCalculate = () => {
    // Simple ROI calculation
    const annualCost = inputs.currentCost * 12;
    const potentialSavings = annualCost * 0.3; // 30% savings assumption
    const implementationCost = 50000;
    const roi = ((potentialSavings - implementationCost) / implementationCost) * 100;
    const paybackMonths = Math.ceil(implementationCost / (potentialSavings / 12));
    const timeReduction = inputs.hoursPerWeek * 0.25; // 25% time reduction

    const calculatedResults: ROIResults = {
      savings: potentialSavings,
      roi: Math.round(roi),
      paybackMonths,
      timeReduction,
    };

    setResults(calculatedResults);
    onCalculate?.(calculatedResults);
  };

  return (
    <Card className={cn('max-w-2xl mx-auto', className)}>
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Monthly Operating Cost ($)</label>
            <input
              type="number"
              value={inputs.currentCost}
              onChange={e => setInputs({ ...inputs, currentCost: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Hours Spent on Manual Tasks (per week)
            </label>
            <input
              type="number"
              value={inputs.hoursPerWeek}
              onChange={e => setInputs({ ...inputs, hoursPerWeek: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Team Size</label>
            <input
              type="number"
              value={inputs.teamSize}
              onChange={e => setInputs({ ...inputs, teamSize: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <Button onClick={handleCalculate} variant="creative" className="w-full">
            Calculate ROI
          </Button>

          {results && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h4 className="font-semibold mb-4">Your Estimated Results</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Annual Savings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${results.savings.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-blue-600">{results.roi}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payback Period</p>
                  <p className="text-2xl font-bold">{results.paybackMonths} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Saved/Week</p>
                  <p className="text-2xl font-bold">{results.timeReduction} hours</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
