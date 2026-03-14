import AddAuthorizedEmail from '../../../components/loginComponents/AddAuthorizedEmail';

export default function AdminEmailsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <AddAuthorizedEmail
              isOpen={true}
              onClose={() => {}}
              onEmailAdded={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
