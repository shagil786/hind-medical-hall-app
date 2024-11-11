import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../provider/authProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const emailOrPhoneSchema = z.string().refine(
  (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  },
  {
    message: 'Invalid email address or phone number',
  }
);

const loginSchema = z.object({
  emailOrPhone: emailOrPhoneSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const otpSchema = z.object({
  emailOrPhone: emailOrPhoneSchema,
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

export function Login({ onModeChange, onClose }: { onModeChange: () => void, onClose: () => void }) {
    const { login, sendOTP, verifyOTP } = useAuth();
    const [isOTPLogin, setIsOTPLogin] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [inputType, setInputType] = useState('text');

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(isOTPLogin ? otpSchema : loginSchema),
        mode: 'onChange',
    });

    const emailOrPhone = watch('emailOrPhone');

    const determineInputType = (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d+$/;

      if (emailRegex.test(value)) {
        return 'email';
      } else if (phoneRegex.test(value)) {
        return 'number';
      }
      return 'text';
    };

    useEffect(() => {
      const subscription = watch((value, { name }) => {
        
        if (name === 'emailOrPhone') {
          setInputType(determineInputType(value?.emailOrPhone));
        }
      });
      return () => subscription.unsubscribe();
    }, [watch('emailOrPhone')]);

    const onSubmit = async (data: any) => {
        if (!isOTPLogin) {
            const result: any = await login(data?.email, data?.password, data?.otp);
            if (result.success) {
                onClose();
            }
        } else if (showOTPInput) {
            const result: any = await verifyOTP(data.otp);
            if (result.success) {
                onClose();
            }
        }
    };

    const handleRequestOTP = async () => {
        const result = await sendOTP(emailOrPhone);
        if (result.success) {
            setShowOTPInput(true);
        }
    };

    const renderEmailInput = useCallback(({ field }: { field: any }) => {
      return (
        <Input
          {...field}
          type={inputType === 'number' ? 'tel' : 'text'}
          inputMode={inputType === 'number' ? 'numeric' : 'text'}
          maxLength={inputType === 'number' ? 10 : undefined}
          placeholder="Email or Phone Number"
          className="w-full pr-24"
          onChange={(e) => {
            let newValue = e.target.value;
            if (inputType === 'number') {
              newValue = newValue.replace(/\D/g, '');
              if (newValue.length > 10) {
                newValue = newValue.slice(0, 10);
              }
            }
            field.onChange({ target: { value: newValue } });
            const newInputType = determineInputType(newValue);
            if (newInputType !== inputType) {
              setInputType(newInputType);
            }
          }}
        />
      );
    }, [inputType, determineInputType]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
                <Controller
                    name="emailOrPhone"
                    control={control}
                    render={renderEmailInput}
                />
                {errors.emailOrPhone && <p className="text-red-500 text-sm mt-1">{errors.emailOrPhone.message?.toString()}</p>}
                {isOTPLogin && !showOTPInput && (
                    <Button
                        type="button"
                        variant="link"
                        className={`${errors.emailOrPhone ? 'top-1/3' : 'top-1/2'} absolute right-2 transform -translate-y-1/2 text-sm`}
                        onClick={handleRequestOTP}
                    >
                        Request OTP
                    </Button>
                )}
            </div>
            {isOTPLogin && showOTPInput && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Enter OTP</label>
                    <Controller
                        name="otp"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                inputMode="numeric"
                                pattern="\d{4}"
                                maxLength={4}
                                className="w-full text-center"
                            />
                        )}
                    />
                    {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message?.toString()}</p>}
                </div>
            )}
            {!isOTPLogin && (
                <div>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="password"
                                placeholder="Password"
                                className="w-full"
                            />
                        )}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message?.toString()}</p>}
                </div>
            )}
            <Button type="submit" className="w-full">
                {isOTPLogin ? (showOTPInput ? 'Verify OTP' : 'Send OTP') : 'Login'}
            </Button>
            <div className="text-center">
                <Button
                    variant="link"
                    onClick={() => {
                        setIsOTPLogin(!isOTPLogin);
                        setShowOTPInput(false);
                        setValue('otp', '');
                    }}
                >
                    {isOTPLogin ? 'Login with password' : 'Login using OTP'}
                </Button>
            </div>
        </form>
    );
}
