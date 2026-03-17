'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoginProvider } from '../../../components/loginComponents/LoginContexte';
import { ResetPassword } from '../../../components/loginComponents/ResetPassword.jsx';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleBack = () => {
    router.push('/');
  };

  const handlePasswordReset = (authToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('user_email', email);
    }
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <LoginProvider>
      <div className="flex flex-col-reverse lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-white">  
        <div className="w-full lg:w-1/2 bg-white p-0 md:p-4 lg:p-8 flex items-center justify-center flex-1 lg:overflow-hidden">
          <div className="w-full">
            <ResetPassword
              email={email}
              token={token}
              onPasswordReset={handlePasswordReset}
            />
          </div>
        </div>
      </div>
    </LoginProvider>
  );
}