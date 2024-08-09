import { Link, useParams, useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { owners, owner_images } from "app/drizzle/schema.server";
import { eq } from "drizzle-orm";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { FaArrowLeft } from "react-icons/fa";

type ProfileWithSignedUrl = {
  id: number;
  name: string;
  image_url: string | null;
  signedImageUrl: string;
  description: string;
  additionalImages: { id: number; image_url: string; signedImageUrl: string }[];
};

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://bbe111b6726945b110b32ab037e4c232.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: "e74dc595a3b18668b5e9f6795929cf3c",
    secretAccessKey:
      "b3c68d4ced82ad17a964d22648266c0a0b6fc55d0cf8b5f775e1183b4616b065",
  },
});

async function getSignedUrlForImage(imageUrl: string) {
  const key = imageUrl.split("/").pop();
  return await getSignedUrl(
    S3,
    new GetObjectCommand({
      Bucket: "who-profile-pictures",
      Key: key,
    }),
    { expiresIn: 3600 }
  );
}

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

  let profileWithSignedUrl = profile[0] as unknown as ProfileWithSignedUrl;

  if (profileWithSignedUrl.image_url) {
    profileWithSignedUrl.signedImageUrl = await getSignedUrlForImage(profileWithSignedUrl.image_url);
  }

  // Fetch additional images
  const additionalImages = await db
    .select()
    .from(owner_images)
    .where(eq(owner_images.owner_name, params.profile!))
    .execute();

  // Generate signed URLs for additional images
  profileWithSignedUrl.additionalImages = await Promise.all(
    additionalImages.map(async (img) => ({
      ...img,
      signedImageUrl: await getSignedUrlForImage(img.image_url),
    }))
  );

  return json(profileWithSignedUrl);
};

export default function Profile() {
  const { profile } = useParams();
  const profileData = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/app/explore");
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="w-full flex flex-col px-24 pt-12 relative">
        <div className="flex flex-row justify-between">
          <div className="border border-black w-64 h-48">
            <img
              src={profileData.signedImageUrl || profileData.image_url || undefined}
              alt={profileData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="border border-black w-72 h-96 absolute right-24">
            <img
              src={profileData.signedImageUrl || profileData.image_url || undefined}
              alt={profileData.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-6 w-full mt-8 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold">
            {profileData.name}
          </h1>
          <p className="text-gray-600 mt-2 text-xl">
            {profileData.description}
          </p>
        </div>
        <div className="flex flex-row justify-between max-w-xs mt-8">
          <Button>Follow</Button>
          <Button>Instagram</Button>
          <Button>Calendly</Button>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full min-h-screen border border-black mt-8 p-4">
          {profileData.additionalImages.map((image, index) => (
            <img
              key={image.id}
              src={image.signedImageUrl}
              alt={`Profile image ${index + 1}`}
              className="object-cover w-full max-h-64"
            />
          ))}
        </div>
      </div>
    </div>
  );
}