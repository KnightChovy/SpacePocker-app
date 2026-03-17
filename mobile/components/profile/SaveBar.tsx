import { Check } from 'lucide-react-native';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
};

export default function SaveBar({ isDirty, isSaving, onSave }: Props) {
  if (!isDirty && !isSaving) return null;

  return (
    <View className="mx-5 mb-4">
      <TouchableOpacity
        onPress={onSave}
        disabled={isSaving}
        activeOpacity={0.85}
        className="rounded-2xl py-4 flex-row items-center justify-center gap-2"
        style={{
          backgroundColor: isSaving ? 'rgba(91,79,233,0.7)' : '#5B4FE9',
          shadowColor: '#5B4FE9',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Check size={18} color="white" strokeWidth={2.5} />
        )}
        <Text className="text-white font-bold text-base">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
