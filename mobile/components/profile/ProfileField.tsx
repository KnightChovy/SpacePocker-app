import { Check, LucideIcon, Pencil, ShieldCheck, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  label: string;
  value: string;
  icon: LucideIcon;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  readonly?: boolean;
  verifiedBadge?: boolean;
  validate?: (val: string) => string | null;
};

export default function ProfileField({
  label,
  value,
  icon: Icon,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  readonly = false,
  verifiedBadge = false,
  validate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const startEdit = () => {
    if (readonly) return;
    setDraft(value);
    setError(null);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const confirm = () => {
    if (validate) {
      const err = validate(draft);
      if (err) {
        setError(err);
        return;
      }
    }
    onChangeText(draft.trim());
    setEditing(false);
    setError(null);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
    setError(null);
  };

  return (
    <View className="mb-5">
      {/* Label row */}
      <View className="flex-row items-center justify-between mb-1.5 px-1">
        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </Text>
        {verifiedBadge && (
          <View className="flex-row items-center gap-1">
            <ShieldCheck size={12} color="#10B981" strokeWidth={2} />
            <Text className="text-xs text-emerald-500 font-medium">
              Verified
            </Text>
          </View>
        )}
        {readonly && !verifiedBadge && (
          <Text className="text-xs text-gray-300 font-medium">Read only</Text>
        )}
      </View>

      {/* Field box */}
      <TouchableOpacity
        onPress={startEdit}
        activeOpacity={readonly ? 1 : 0.7}
        disabled={editing}
      >
        <View
          className="flex-row items-center rounded-2xl px-4 py-3.5 border"
          style={{
            borderColor: editing ? '#5B4FE9' : error ? '#FCA5A5' : '#F3F4F6',
            backgroundColor: error && !editing ? '#FEF2F2' : '#FFFFFF',
            shadowColor: editing ? '#5B4FE9' : '#000',
            shadowOffset: { width: 0, height: editing ? 2 : 0 },
            shadowOpacity: editing ? 0.1 : 0,
            shadowRadius: editing ? 6 : 0,
            elevation: editing ? 3 : 0,
          }}
        >
          {/* Icon */}
          <View className="w-8 h-8 rounded-xl bg-gray-50 items-center justify-center mr-3">
            <Icon
              size={15}
              color={editing ? '#5B4FE9' : '#9CA3AF'}
              strokeWidth={1.8}
            />
          </View>

          {/* Input */}
          <TextInput
            ref={inputRef}
            value={editing ? draft : value}
            onChangeText={setDraft}
            editable={editing && !readonly}
            placeholder={placeholder}
            placeholderTextColor="#D1D5DB"
            keyboardType={keyboardType}
            returnKeyType="done"
            onSubmitEditing={confirm}
            className="flex-1 text-gray-800 text-sm font-medium"
            style={{ paddingVertical: 0 }}
          />

          {/* Action buttons */}
          {!readonly && (
            <View className="flex-row items-center gap-1.5 ml-2">
              {editing ? (
                <>
                  <TouchableOpacity
                    onPress={cancel}
                    className="w-7 h-7 rounded-lg bg-gray-100 items-center justify-center"
                  >
                    <X size={13} color="#6B7280" strokeWidth={2.5} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={confirm}
                    className="w-7 h-7 rounded-lg bg-[#5B4FE9] items-center justify-center"
                  >
                    <Check size={13} color="white" strokeWidth={2.5} />
                  </TouchableOpacity>
                </>
              ) : (
                <View className="w-7 h-7 rounded-lg bg-gray-50 items-center justify-center">
                  <Pencil size={13} color="#9CA3AF" strokeWidth={1.8} />
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Error */}
      {error && (
        <Text className="text-xs text-red-400 mt-1.5 px-1">{error}</Text>
      )}
    </View>
  );
}
