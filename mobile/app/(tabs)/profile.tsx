import {
  Bell,
  Briefcase,
  ChevronLeft,
  Mail,
  Phone,
  User,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LogoutButton from '@/components/profile/LogoutButton';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileField from '@/components/profile/ProfileField';
import SaveBar from '@/components/profile/SaveBar';
import userService from '@/services/user.service';
import { useAuthStore } from '@/store/authStore';

function validatePhone(val: string) {
  if (!val) return 'Phone number is required';
  if (!/^[\d\s\+\-\(\)]{7,}$/.test(val)) return 'Enter a valid phone number';
  return null;
}

function validateName(val: string) {
  if (!val.trim()) return 'Name is required';
  if (val.trim().length < 2) return 'Name is too short';
  return null;
}

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuthStore();

  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
  });
  const [saved, setSaved] = useState(form);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = form.name !== saved.name || form.phone !== saved.phone;

  const update = useCallback(
    (key: keyof typeof form) => (value: string) => {
      setForm(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await userService.updateProfile({
        name: form.name,
        phoneNumber: form.phone,
      });
      await updateUser(res.metadata);
      setSaved(form);
    } catch {
      // keep form dirty so user can retry
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3 bg-gray-50">
          <TouchableOpacity
            className="w-10 h-10 rounded-xl bg-white items-center justify-center border border-gray-100"
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color="#374151" strokeWidth={2} />
          </TouchableOpacity>

          <Text className="text-base font-bold text-gray-900">
            Profile Settings
          </Text>

          <TouchableOpacity
            className="w-10 h-10 rounded-xl bg-white items-center justify-center border border-gray-100 relative"
            activeOpacity={0.7}
          >
            <Bell size={18} color="#374151" strokeWidth={1.8} />
            {/* Notification dot */}
            <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#5B4FE9]" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: isDirty || isSaving ? 160 : 96,
          }}
        >
          <View className="bg-white mx-4 mt-3 rounded-3xl shadow-sm shadow-black/5">
            <ProfileAvatar
              name={form.name || user?.name || ''}
              role={user?.role ?? ''}
            />

            {/* Dirty indicator pill */}
            {isDirty && (
              <View className="items-center pb-4">
                <View className="bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                  <Text className="text-amber-600 text-xs font-medium">
                    Unsaved changes
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Personal Information */}
          <View className="bg-white mx-4 mt-3 rounded-3xl px-5 pt-5 pb-2 shadow-sm shadow-black/5">
            <Text className="text-base font-bold text-gray-900 mb-5">
              Personal Information
            </Text>

            <ProfileField
              label="Full Name"
              value={form.name}
              icon={User}
              onChangeText={update('name')}
              placeholder="Your full name"
              validate={validateName}
            />

            <ProfileField
              label="Role / Title"
              value={user?.role ?? ''}
              icon={Briefcase}
              onChangeText={() => {}}
              placeholder="Your role"
              readonly
            />
          </View>

          {/* Contact */}
          <View className="bg-white mx-4 mt-3 rounded-3xl px-5 pt-5 pb-2 shadow-sm shadow-black/5">
            <Text className="text-base font-bold text-gray-900 mb-5">
              Contact
            </Text>

            <ProfileField
              label="Email Address"
              value={user?.email ?? ''}
              icon={Mail}
              onChangeText={() => {}}
              readonly
              verifiedBadge
            />

            <ProfileField
              label="Phone Number"
              value={form.phone}
              icon={Phone}
              onChangeText={update('phone')}
              keyboardType="phone-pad"
              placeholder="+1 (555) 000-0000"
              validate={validatePhone}
            />
          </View>
        </ScrollView>

        <SaveBar isDirty={isDirty} isSaving={isSaving} onSave={handleSave} />

        <LogoutButton onLogout={handleLogout} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
