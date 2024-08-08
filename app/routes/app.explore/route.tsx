import { Button } from "~/components/ui/button";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { doTheDbThing } from "lib/dbThing";
import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { owners } from "app/drizzle/schema.server";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://bbe111b6726945b110b32ab037e4c232.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: "e74dc595a3b18668b5e9f6795929cf3c",
    secretAccessKey:
      "b3c68d4ced82ad17a964d22648266c0a0b6fc55d0cf8b5f775e1183b4616b065",
  },
});

// Define types
interface ServiceCardProps {
  title: string;
  description?: string;
  rating?: number;
  image?: string;
  id?: string;
}

interface ServiceData extends ServiceCardProps {}

type OwnerData = {
  id: number;
  name: string;
  image_url: string | null;
  signedImageUrl?: string;
  description?: string;
};

// Reusable Card Component
function ServiceCard({
  title,
  description,
  rating,
  image,
  id,
}: ServiceCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/app/profile/${id}`);
  };
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 w-[290px] border border-black"
      onClick={handleClick}
    >
      <img
        src={image || "/default-profile.png"}
        alt={title}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="mt-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {description && <p className="text-gray-600 mt-2">{description}</p>}
        {rating && (
          <div className="flex items-center mt-2">
            <span className="text-yellow-500">★</span>
            <span className="ml-1">{rating.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { db } = await doTheDbThing({ context });

  const ownersData = await db.select().from(owners);

  const ownersWithSignedUrls = await Promise.all(
    ownersData.map(async (owner) => {
      if (owner.image_url) {
        const key = owner.image_url.split("/").pop(); // Extract the file name from the URL
        const signedUrl = await getSignedUrl(
          S3,
          new GetObjectCommand({
            Bucket: "who-profile-pictures",
            Key: key,
          }),
          { expiresIn: 3600 }
        );
        return { ...owner, signedImageUrl: signedUrl };
      }
      return owner;
    })
  );

  return json({ ownersData: ownersWithSignedUrls });
}
export default function Explore() {
  const { ownersData } = useLoaderData<typeof loader>();

  const buttonRoutes: Record<string, string> = {
    All: "/explore/all",
    "Hair Care": "/explore/hair-care",
    Tutoring: "/explore/tutoring",
    Art: "/explore/art",
    Food: "/explore/food",
    "Fix-It": "/explore/fix-it",
  };

  return (
    <div className="flex flex-col w-full min-h-screen ">
      <div className="flex w-full justify-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold pt-8">
          Explore
        </h1>
      </div>
      {/* Filter  */}
      <div className="flex flex-wrap justify-start gap-2 pt-8 pb-6 sm:pt-12 sm:pb-10">
        {Object.entries(buttonRoutes).map(([name, route]) => (
          <Button
            key={name}
            variant="outline"
            className="px-8 py-6 mb-2 text-md"
          >
            {name}
          </Button>
        ))}
      </div>
      {/* Profile grid  */}
      <div className="w-full flex">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {ownersData.map(
            (owner: {
              description: string | null;
              id: number;
              name: string;
              image_url: string | null;
              signedImageUrl?: string;
            }) => (
              <ServiceCard
                key={owner.id}
                title={owner.name}
                image={owner.signedImageUrl || owner.image_url || undefined}
                id={owner.name}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
