import { Link, useParams, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { owners } from "app/drizzle/schema.server";
import { eq } from "drizzle-orm";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

type ProfileWithSignedUrl = {
  id: number;
  name: string;
  image_url: string | null;
  signedImageUrl: string;
  description: string;
  images: string;
};

// Assuming you have an S3 client setup somewhere in your app
const S3 = new S3Client({
  region: "auto",
  endpoint: `https://bbe111b6726945b110b32ab037e4c232.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: "e74dc595a3b18668b5e9f6795929cf3c",
    secretAccessKey:
      "b3c68d4ced82ad17a964d22648266c0a0b6fc55d0cf8b5f775e1183b4616b065",
  },
});

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const db = drizzle(context.cloudflare.env.DB);
  const profile = await db
    .select()
    .from(owners)
    .where(eq(owners.name, params.profile!))
    .limit(1)
    .execute();

  if (profile.length === 0) {
    throw new Response("Not Found", { status: 404 });
  }

  let profileWithSignedUrl = profile[0];

  if (profileWithSignedUrl.image_url) {
    const key = profileWithSignedUrl.image_url.split("/").pop(); // Extract the file name from the URL
    const signedUrl = await getSignedUrl(
      S3,
      new GetObjectCommand({
        Bucket: "who-profile-pictures",
        Key: key,
      }),
      { expiresIn: 3600 }
    );
    profileWithSignedUrl = {
      ...profileWithSignedUrl,
      signedImageUrl: signedUrl,
    } as ProfileWithSignedUrl;
  }

  // In the loader function
  return json(profileWithSignedUrl as ProfileWithSignedUrl);
};

export default function Profile() {
  const { profile } = useParams();
  console.log("Profile Data", profile);
  const profileData = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="w-full flex flex-col p-24 relative">
        <div className="flex flex-row justify-between">
          <div className="border border-black w-64 h-48">
            <img
              src={
                profileData.signedImageUrl || profileData.image_url || undefined
              }
              alt={profileData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="border border-black w-72 h-96 absolute top-24 right-24">
            <img
              src={
                profileData.signedImageUrl || profileData.image_url || undefined
              }
              alt={profileData.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-6 w-full mt-8 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold">
            {profileData.name}
          </h1>
          <p className="text-gray-600 mt-2">{profileData.description}</p>
          {/* Rest of your JSX remains the same */}
        </div>
        <div className="flex flex-row justify-between max-w-md mt-8">
          <Button>Follow</Button>
          <Button>Instagram</Button>
          <Button>Calendly</Button>
        </div>
        <div className="flex flex-row justify-between max-w-md border border-black mt-8"></div>
      </div>
    </div>
  );
}
