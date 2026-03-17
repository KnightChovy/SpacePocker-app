import { Camera, ImagePlus, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  name: string;
  role: string;
  avatarUri?: string;
  onChangeAvatar?: () => void;
  onRemoveAvatar?: () => void;
};

export default function ProfileAvatar({
  name,
  role,
  avatarUri,
  onChangeAvatar,
  onRemoveAvatar,
}: Props) {
  const [showSheet, setShowSheet] = useState(false);

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const actions = [
    {
      icon: Camera,
      label: 'Take Photo',
      onPress: () => {
        onChangeAvatar?.();
        setShowSheet(false);
      },
    },
    {
      icon: ImagePlus,
      label: 'Choose from Library',
      onPress: () => {
        onChangeAvatar?.();
        setShowSheet(false);
      },
    },
    ...(avatarUri
      ? [
          {
            icon: Trash2,
            label: 'Remove Photo',
            destructive: true,
            onPress: () => {
              onRemoveAvatar?.();
              setShowSheet(false);
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <View className="items-center pt-6 pb-4">
        {/* Avatar */}
        <TouchableOpacity
          onPress={() => setShowSheet(true)}
          activeOpacity={0.85}
          className="relative mb-4"
        >
          <View className="w-24 h-24 rounded-full bg-[#EEF0FF] items-center justify-center overflow-hidden shadow-md shadow-black/10">
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-[#5B4FE9] text-3xl font-bold">
                {initials}
              </Text>
            )}
          </View>

          {/* Camera badge */}
          <View className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#5B4FE9] items-center justify-center shadow-sm shadow-[#5B4FE9]/40">
            <Camera size={14} color="white" strokeWidth={2} />
          </View>
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900">{name}</Text>
        <Text className="text-sm text-gray-400 mt-0.5">{role}</Text>
      </View>

      {/* Action Sheet Modal */}
      <Modal
        visible={showSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSheet(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setShowSheet(false)}
        >
          <Pressable onPress={() => {}}>
            <View className="bg-white rounded-t-3xl px-4 pt-3 pb-8">
              {/* Handle */}
              <View className="w-10 h-1 rounded-full bg-gray-200 self-center mb-5" />

              <View className="flex-row items-center justify-between mb-4 px-1">
                <Text className="text-base font-bold text-gray-900">
                  Profile Photo
                </Text>
                <TouchableOpacity onPress={() => setShowSheet(false)}>
                  <X size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {actions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={action.onPress}
                    activeOpacity={0.7}
                    className={`flex-row items-center gap-4 py-4 px-1 ${
                      i < actions.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <View
                      className={`w-10 h-10 rounded-xl items-center justify-center ${
                        action.destructive ? 'bg-red-50' : 'bg-[#EEF0FF]'
                      }`}
                    >
                      <Icon
                        size={18}
                        color={action.destructive ? '#EF4444' : '#5B4FE9'}
                        strokeWidth={1.8}
                      />
                    </View>
                    <Text
                      className={`text-base font-medium ${
                        action.destructive ? 'text-red-500' : 'text-gray-800'
                      }`}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
