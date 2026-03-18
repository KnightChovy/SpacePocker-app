import { Search, X } from 'lucide-react-native';
import { TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
};

export default function SearchBar({ value, onChangeText, onClear }: Props) {
  return (
    <View
      className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-100"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Search size={18} color="#9CA3AF" strokeWidth={2} />
      <TextInput
        className="flex-1 ml-3 text-gray-800 text-sm"
        placeholder="Search by name or code..."
        placeholderTextColor="#D1D5DB"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        style={{ paddingVertical: 0 }}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} hitSlop={8}>
          <X size={16} color="#9CA3AF" strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  );
}
