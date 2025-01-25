import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../provider/authProvider";

interface SignupProps {
  step: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onModeChange: () => void;
  onClose: () => void;
}

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup({
  step,
  onNextStep,
  onPrevStep,
  onModeChange,
  onClose,
}: SignupProps) {
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(4).fill("")
  );

  const onSubmit = async (data: SignupFormData) => {
    console.log("onSubmit", data);
    try {
      await signup(data?.name, data?.email, data?.password, data?.phoneNumber);
      onNextStep();
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value.length === 1 && index < 3) {
        const nextInput = document.getElementById(`verification-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleVerificationCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && index > 0 && verificationCode[index] === "") {
      const prevInput = document.getElementById(`verification-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join("");
    // Handle verification logic here
    console.log("Verification code:", code);
    onNextStep();
  };

  return (
    <div className="space-y-4">
      {step === 0 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message?.toString()}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message?.toString()}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              id="phoneNumber"
              type="number"
              inputMode="numeric"
              maxLength={10}
              {...register("phoneNumber")}
              placeholder="Enter your phone number"
            />
            {errors.phoneNumber && (
              <p className="text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Next
          </Button>
        </form>
      )}
      {step === 1 && (
        <form onSubmit={handleVerification} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, index) => (
                <Input
                  key={index}
                  id={`verification-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{1}"
                  maxLength={1}
                  value={verificationCode[index]}
                  onChange={(e) =>
                    handleVerificationCodeChange(index, e.target.value)
                  }
                  onKeyDown={(e) => handleVerificationCodeKeyDown(index, e)}
                  className="w-12 text-center"
                  required
                />
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Verify
          </Button>
          <Button
            variant="outline"
            onClick={onPrevStep}
            className="w-full mt-2"
          >
            Back
          </Button>
        </form>
      )}
      {step === 2 && (
        <div className="text-center space-y-4">
          <p>Your account has been activated! You can now log in.</p>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
