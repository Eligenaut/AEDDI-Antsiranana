'use client';

import { LoginProvider } from '../../../components/loginComponents/LoginContexte';
import { ForgetPassword } from '../../../components/loginComponents/ForgetPassword';
import { useRouter } from 'next/navigation';

export default function MotDePasseOubliePage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <LoginProvider>
      <div className="flex flex-col-reverse lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-white">
        <div className="w-full lg:w-1/2 bg-white p-0 md:p-4 lg:p-8 flex items-center justify-center flex-1 lg:overflow-hidden">
          <div className="w-full">
            <ForgetPassword onBack={handleBack} />
          </div>
        </div>
      </div>
    </LoginProvider>
  );
}
