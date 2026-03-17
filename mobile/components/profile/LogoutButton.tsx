import { AlertTriangle, LogOut } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  onLogout: () => void;
};

export default function LogoutButton({ onLogout }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <View className="mx-5 mb-8">
        <TouchableOpacity
          onPress={() => setShowConfirm(true)}
          activeOpacity={0.7}
          className="flex-row items-center justify-center gap-2.5 py-4 rounded-2xl border border-red-100 bg-red-50/60"
        >
          <LogOut size={18} color="#EF4444" strokeWidth={1.8} />
          <Text className="text-red-500 font-semibold text-base">Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Confirm Modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 items-center justify-center px-6"
          onPress={() => setShowConfirm(false)}
        >
          <Pressable onPress={() => {}}>
            <View className="bg-white rounded-3xl p-6 w-full">
              <View className="w-14 h-14 rounded-2xl bg-red-50 items-center justify-center self-center mb-4">
                <AlertTriangle size={28} color="#EF4444" strokeWidth={1.8} />
              </View>
              <Text className="text-lg font-bold text-gray-900 text-center mb-1">
                Log Out?
              </Text>
              <Text className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
                You'll need to sign in again to access your account.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowConfirm(false);
                  onLogout();
                }}
                className="bg-red-500 rounded-2xl py-3.5 mb-3 items-center"
                activeOpacity={0.85}
              >
                <Text className="text-white font-bold text-base">
                  Yes, Log Out
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="bg-gray-100 rounded-2xl py-3.5 items-center"
                activeOpacity={0.7}
              >
                <Text className="text-gray-600 font-semibold text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
