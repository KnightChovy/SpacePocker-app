import React from 'react';
import type { Feature } from '@/types/types';
import { ShieldCheck, Snowflake, Zap } from 'lucide-react';

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-gray-50 p-8 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-hover">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {feature.icon === 'zap' && <Zap className="text-primary" />}
        {feature.icon === 'shield_check' && (
          <ShieldCheck className="text-primary" />
        )}
        {feature.icon === 'snowflake' && <Snowflake className="text-primary" />}
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#0e0d1b]">{feature.title}</h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
