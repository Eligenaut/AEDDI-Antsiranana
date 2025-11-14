'use client';

import { LoginProvider } from '../../components/loginComponents/LoginContexte';
import { ForgotPasswordForm } from '../../components/loginComponents/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <LoginProvider>
      <ForgotPasswordForm />
    </LoginProvider>
  );
}

