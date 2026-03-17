import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { loginSchema, type LoginFormData } from '@/schema/auth.schema';
import { useAuthStore } from '@/store/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, Text } from 'react-native';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      console.log(data, 'dattata');

      router.replace('/(tabs)/home');
    } catch (err: any) {
      console.log(err);

      Alert.alert('Login failed', err.message);
    }
  };

  return (
    <VStack space="lg">
      <Text className="text-typography-900 text-2xl font-bold mb-1 text-center">
        Welcome Back
      </Text>
      <Text className="text-typography-400 text-sm mb-6 text-center">
        Please sign in to access your dashboard
      </Text>

      <FormControl isInvalid={!!errors.email}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              className="h-14 rounded-2xl bg-background-50 border-outline-100"
              variant="outline"
            >
              <InputSlot className="pl-4">
                <InputIcon as={Mail} className="text-typography-400" />
              </InputSlot>
              <InputField
                placeholder="Email address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                className="text-typography-700"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorText className="text-xs">
            {errors.email?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.password} className="mt-1">
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              className="h-14 rounded-2xl bg-background-50 border-outline-100"
              variant="outline"
            >
              <InputSlot className="pl-4">
                <InputIcon as={Lock} className="text-typography-400" />
              </InputSlot>
              <InputField
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showPassword}
                className="text-typography-700"
              />
              <InputSlot
                className="pr-4"
                onPress={() => setShowPassword(v => !v)}
              >
                <InputIcon
                  as={showPassword ? Eye : EyeOff}
                  className="text-typography-400"
                />
              </InputSlot>
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorText className="text-xs">
            {errors.password?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      {/* <Pressable
        className="self-end mt-1 mb-4"
        onPress={() => router.push('/(auth)/forgot-password')}
      >
        <Text className="text-[#5B5BD6] text-sm font-medium">
          Forgot Password?
        </Text>
      </Pressable> */}

      <Button
        onPress={handleSubmit(onSubmit)}
        isDisabled={isSubmitting}
        className="h-14 rounded-2xl bg-[#5B5BD6]"
      >
        {isSubmitting ? (
          <ButtonSpinner color="white" />
        ) : (
          <ButtonText className="text-white font-bold tracking-wide">
            Sign In
          </ButtonText>
        )}
      </Button>

      <HStack className="justify-center mt-5">
        <Text className="text-typography-400 text-sm">
          Don`t have an account?{' '}
        </Text>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text className="text-[#5B5BD6] text-sm font-semibold">
            Sign up for free
          </Text>
        </Pressable>
      </HStack>
    </VStack>
  );
}
