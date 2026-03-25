import { Check } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

const LABELS = ['Time', 'Extras', 'Review'];

type Props = {
  currentStep: number;
  totalSteps: number;
};

export default function StepIndicator({ currentStep, totalSteps }: Props) {
  return (
    <View className="flex-row items-center justify-center px-8 py-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;

        return (
          <React.Fragment key={step}>
            <View className="items-center">
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{
                  backgroundColor: done || active ? '#5B4FE9' : '#E5E7EB',
                }}
              >
                {done ? (
                  <Check size={14} color="white" strokeWidth={2.5} />
                ) : (
                  <Text
                    className="text-sm font-bold"
                    style={{ color: active ? 'white' : '#9CA3AF' }}
                  >
                    {step}
                  </Text>
                )}
              </View>
              <Text
                className="text-xs mt-1 font-semibold"
                style={{ color: done || active ? '#5B4FE9' : '#9CA3AF' }}
              >
                {LABELS[i]}
              </Text>
            </View>

            {step < totalSteps && (
              <View
                className="flex-1 h-0.5 mx-2 mb-4"
                style={{ backgroundColor: done ? '#5B4FE9' : '#E5E7EB' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
