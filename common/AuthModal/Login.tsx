import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../provider/authProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const otpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

export function Login({ onModeChange, onClose }: { onModeChange: () => void, onClose: () => void }) {
    const { login, sendOTP, verifyOTP } = useAuth();
    const [isOTPLogin, setIsOTPLogin] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(isOTPLogin ? otpSchema : loginSchema),
        mode: 'onBlur',
    });

    const email = watch('email');

    const onSubmit = async (data: any) => {
        if (!isOTPLogin) {
            const result: any = await login(data.email, data.password);
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
        const result = await sendOTP(email);
        if (result.success) {
            setShowOTPInput(true);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <div className="relative">
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="email"
                            placeholder="Email or Phone Number"
                            className="w-full pr-24"
                        />
                    )}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message?.toString()}</p>}
                {isOTPLogin && !showOTPInput && (
                    <Button
                        type="button"
                        variant="link"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
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
