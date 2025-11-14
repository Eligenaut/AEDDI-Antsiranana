'use client';

import { LoginProvider } from '../../components/loginComponents/LoginContexte';
import { ForgotPasswordForm } from '../../components/loginComponents/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const handleBack = () => {};

  return (
    <LoginProvider>
      <ForgotPasswordForm onBack={handleBack} />
    </LoginProvider>
  );
}

