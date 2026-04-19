import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface CostData {
  service: string;
  currentMonth: number;
  previousMonth: number;
  forecast: number;
}

const AWSCostOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [costs, setCosts] = useState<CostData[]>([]);
  const [totalCost, setTotalCost] = useState({ current: 0, previous: 0, forecast: 0 });

  useEffect(() => {
    // In a real app, we would fetch the actual AWS cost data
    // For demo purposes, we'll use mock data
    const mockCosts: CostData[] = [
      {
        service: 'EC2',
        currentMonth: 1245.67,
        previousMonth: 1320.45,
        forecast: 1200.00
      },
      {
        service: 'S3',
        currentMonth: 356.78,
        previousMonth: 298.56,
        forecast: 380.00
      },
      {
        service: 'RDS',
        currentMonth: 678.90,
        previousMonth: 645.32,
        forecast: 700.00
      },
      {
        service: 'Lambda',
        currentMonth: 123.45,
        previousMonth: 98.76,
        forecast: 150.00
      },
      {
        service: 'Other',
        currentMonth: 432.10,
        previousMonth: 387.65,
        forecast: 450.00
      }
    ];

    // Calculate totals
    const current = mockCosts.reduce((sum, item) => sum + item.currentMonth, 0);
    const previous = mockCosts.reduce((sum, item) => sum + item.previousMonth, 0);
    const forecast = mockCosts.reduce((sum, item) => sum + item.forecast, 0);

    // Simulate API call
    setTimeout(() => {
      setCosts(mockCosts);
      setTotalCost({ current, previous, forecast });
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getPercentChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const renderTrend = (current: number, previous: number) => {
    const percentChange = getPercentChange(current, previous);
    const isIncrease = percentChange > 0;
    
    return (
      <div className={`flex items-center ${isIncrease ? 'text-red-500' : 'text-green-500'}`}>
        {isIncrease ? (
          <TrendingUp size={14} className="mr-1" />
        ) : (
          <TrendingDown size={14} className="mr-1" />
        )}
        <span>{Math.abs(percentChange).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <h3 className="text-md uppercase tracking-wider border-b border-[#33FF00]/30 pb-2 mb-4 text-[#33FF00]">
        AWS Cost Overview
      </h3>
      
      {loading ? (
        <div className="text-center text-[#33FF00]/70 animate-pulse py-4">
          Loading cost data...
        </div>
      ) : (
        <>
          <div className="mb-4 p-3 border border-[#33FF00]/30 rounded-sm bg-[#111]/50">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <DollarSign size={18} className="text-[#33FF00] mr-2" />
                <span className="text-[#33FF00]">Total Cost (MTD)</span>
              </div>
              <div className="text-lg text-[#33FF00]">
                {formatCurrency(totalCost.current)}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="text-[#33FF00]/70">
                vs. Last Month: {formatCurrency(totalCost.previous)}
              </div>
              {renderTrend(totalCost.current, totalCost.previous)}
            </div>
            <div className="flex justify-between text-sm mt-1">
              <div className="text-[#33FF00]/70">
                Forecast: {formatCurrency(totalCost.forecast)}
              </div>
              {totalCost.forecast > totalCost.previous && (
                <div className="flex items-center text-yellow-500">
                  <AlertCircle size={14} className="mr-1" />
                  <span>Trending higher</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-4 text-xs text-[#33FF00]/70 pb-1 border-b border-[#33FF00]/20">
              <div>Service</div>
              <div className="text-right">Current</div>
              <div className="text-right">Previous</div>
              <div className="text-right">Change</div>
            </div>
            
            {costs.map((cost) => (
              <div key={cost.service} className="grid grid-cols-4 text-sm">
                <div className="text-[#33FF00]">{cost.service}</div>
                <div className="text-right">{formatCurrency(cost.currentMonth)}</div>
                <div className="text-right text-[#33FF00]/70">{formatCurrency(cost.previousMonth)}</div>
                <div className="text-right">
                  {renderTrend(cost.currentMonth, cost.previousMonth)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      <div className="mt-4 pt-2 border-t border-[#33FF00]/30 text-xs text-[#33FF00]/50">
        Data as of {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default AWSCostOverview;