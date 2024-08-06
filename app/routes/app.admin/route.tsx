import { Form, useActionData, useNavigation } from '@remix-run/react';
import { json, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from '@remix-run/cloudflare';

export const action = async ({ request }: any) => {
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 5_000_000, // 5 MB
  });
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  
  // Here you would typically process the form data and save it to your database
  // For now, we're just returning the data as JSON
  const data = Object.fromEntries(formData);
  console.log(data);
  return json(data);
};

export default function BusinessProfileForm() {
  const actionData = useActionData();
  const navigation = useNavigation();

  return (
    <div className="max-w-md mx-auto mt-8">
      <Form method="post" encType="multipart/form-data" className="space-y-4">
        <div>
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="businessBio" className="block text-sm font-medium text-gray-700">
            Business Bio
          </label>
          <textarea
            id="businessBio"
            name="businessBio"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
            Instagram
          </label>
          <input
            type="text"
            id="instagram"
            name="instagram"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="bookingService" className="block text-sm font-medium text-gray-700">
            Calendly or other booking service (optional)
          </label>
          <input
            type="text"
            id="bookingService"
            name="bookingService"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={navigation.state === 'submitting'}
        >
          {navigation.state === 'submitting' ? 'Submitting...' : 'Submit'}
        </button>
      </Form>

    </div>
  );
}