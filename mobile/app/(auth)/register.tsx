import AuthHeader from '@/components/auth/AuthHeader';
import RegisterForm from '@/components/auth/register/RegisterForm';
import { Box } from '@/components/ui/box';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#5B5BD6]" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Box style={{ flex: 0.25 }}>
            <AuthHeader />
          </Box>

          <Box
            className="bg-background-0 flex-1 px-6 pt-8 pb-6"
            style={{ borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
          >
            <RegisterForm />
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
