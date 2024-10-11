'use client';
import React from 'react';
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Stepper } from './Stepper';
import { Login as LoginComponent } from './Login';
import Signup from './Signup';
import { useAuth } from '../../provider/authProvider';
import { useSafeArea } from '@/provider/safeAreaProvider';

interface AuthStepProps {
  step: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onModeChange: () => void;
  onClose: () => void;
}

const AuthStep: React.FC<AuthStepProps> = ({ step, onNextStep, onPrevStep, onModeChange, onClose }) => {
  const { mode } = useAuth();
  
  return mode === 'login' ? (
    <LoginComponent onModeChange={onModeChange} onClose={onClose} />
  ) : (
    <Signup
      step={step}
      onNextStep={onNextStep}
      onPrevStep={onPrevStep}
      onModeChange={onModeChange}
      onClose={onClose}
    />
  );
};

export function AuthModal() {
  const { show, handleShow, mode, setMode } = useAuth();
  const [step, setStep] = React.useState(0);
  const { safeAreaClasses } = useSafeArea();

  const loginSteps = ['Credentials', 'Verification'];
  const signupSteps = ['Information', 'Verification', 'Activation'];

  const resetState = () => {
    setStep(0);
    setMode('login');
  };

  const handleClose = () => {
    handleShow();
    resetState();
  };

  return (
    <Dialog open={show} onOpenChange={handleShow}>
      <DialogContent className={`w-11/12 rounded-xl p-0 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800`}>
        <div className="flex flex-col h-full">
          <div className="p-6 bg-white dark:bg-gray-800 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
            </div>
            <Stepper
              steps={mode === 'login' ? loginSteps : signupSteps}
              currentStep={step}
            />
          </div>
          <div className="flex-grow p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${step}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AuthStep
                  step={step}
                  onNextStep={() => setStep(step + 1)}
                  onPrevStep={() => setStep(step - 1)}
                  onModeChange={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setStep(0);
                  }}
                  onClose={handleClose}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant="link"
                className="ml-1 text-blue-600 dark:text-blue-400"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setStep(0);
                }}
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </Button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
