'use client';

import { useState } from 'react';
import { LoginProvider } from './LoginContexte';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { RegistrationFlow } from './RegistrationFlow';

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [useNewFlow, setUseNewFlow] = useState(true);

  return (
    <LoginProvider>
      <div className="flex items-center justify-center bg-white p-1">
        {showRegister ? (
          useNewFlow ? (
            <RegistrationFlow />
          ) : (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          )
        ) : (
          <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    </LoginProvider>
  );
}
