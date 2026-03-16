import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { registerSchema, type RegisterFormData } from '@/schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, Text } from 'react-native';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // await register(data);
      router.replace('/(tabs)/home');
    } catch (e: any) {
      Alert.alert('Registration failed', e.message);
    }
  };

  return (
    <VStack space="lg">
      <Text className="text-typography-900 text-2xl font-bold mb-1 text-center">
        Create an Account
      </Text>
      <Text className="text-typography-400 text-sm mb-6 text-center">
        Sign up to get started
      </Text>

      <FormControl isInvalid={!!errors.name}>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              className="h-14 rounded-2xl bg-background-50 border-outline-100"
              variant="outline"
            >
              <InputSlot className="pl-4">
                <InputIcon as={User} className="text-typography-400" />
              </InputSlot>
              <InputField
                placeholder="Full Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                className="text-typography-700"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorText className="text-xs">
            {errors.name?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.phone}>
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              className="h-14 rounded-2xl bg-background-50 border-outline-100"
              variant="outline"
            >
              <InputSlot className="pl-4">
                <InputIcon as={Phone} className="text-typography-400" />
              </InputSlot>
              <InputField
                placeholder="Phone Number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                className="text-typography-700"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorText className="text-xs">
            {errors.phone?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

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

      <FormControl isInvalid={!!errors.password}>
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

      <FormControl isInvalid={!!errors.confirmPassword}>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              className="h-14 rounded-2xl bg-background-50 border-outline-100"
              variant="outline"
            >
              <InputSlot className="pl-4">
                <InputIcon as={Lock} className="text-typography-400" />
              </InputSlot>
              <InputField
                placeholder="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showConfirmPassword}
                className="text-typography-700"
              />
              <InputSlot
                className="pr-4"
                onPress={() => setShowConfirmPassword(v => !v)}
              >
                <InputIcon
                  as={showConfirmPassword ? Eye : EyeOff}
                  className="text-typography-400"
                />
              </InputSlot>
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorText className="text-xs">
            {errors.confirmPassword?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <Button
        onPress={handleSubmit(onSubmit)}
        isDisabled={isSubmitting}
        className="h-14 rounded-2xl bg-[#5B5BD6] mt-4"
      >
        {isSubmitting ? (
          <ButtonSpinner color="white" />
        ) : (
          <ButtonText className="text-white font-bold tracking-wide">
            Sign Up
          </ButtonText>
        )}
      </Button>

      <HStack className="justify-center mt-5">
        <Text className="text-typography-400 text-sm">
          Already have an account?{' '}
        </Text>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text className="text-[#5B5BD6] text-sm font-semibold">Sign In</Text>
        </Pressable>
      </HStack>
    </VStack>
  );
}
