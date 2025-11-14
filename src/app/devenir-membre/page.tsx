import { Suspense } from 'react';
import { RegistrationFlow } from '../../../components/loginComponents/RegistrationFlow.jsx';

export default function DevenirMembrePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <RegistrationFlow />
    </Suspense>
  );
}

