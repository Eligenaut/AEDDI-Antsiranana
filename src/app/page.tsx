import { AccueilContent } from '../../components/loginComponents/AccueilContent.jsx';
import AuthPage from '../../components/loginComponents/AuthPage.jsx';
export default function HomePage() {
  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-white">
      <div className="w-full lg:w-1/2 p-0 flex flex-col flex-1 lg:overflow-hidden">
        <AccueilContent />
      </div>     
      <div className="w-full lg:w-1/2 bg-white p-0 md:p-4 lg:p-8 flex items-center justify-center flex-1 lg:overflow-hidden">
        <div className="w-full">
          <AuthPage />
        </div>
      </div>
    </div>
  );
}
