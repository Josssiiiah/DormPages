import { Link, useParams, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { owners } from "app/drizzle/schema.server";
import { eq } from "drizzle-orm";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const db = drizzle(context.cloudflare.env.DB);
  const profile = await db.select()
    .from(owners)
    .where(eq(owners.name, params.profile!))
    .limit(1)
    .execute();

  if (profile.length === 0) {
    throw new Response("Not Found", { status: 404 });
  }

  return json(profile[0]);
};

export default function Profile() {
  const { profile } = useParams();
  console.log("PRofile Data", profile); 
  const profileData = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="w-full flex flex-col p-24 relative">
        <div className="flex flex-row justify-between">
          <div className="border border-black w-64 h-48">
          <img src={profileData.image_url ?? undefined} alt={profileData.name} className="w-full h-full object-cover" />
          </div>
          <div className="border border-black w-72 h-96 absolute top-24 right-24">
          <img src={profileData.image_url ?? undefined} alt={profileData.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col space-y-6 w-full mt-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold">
            {profileData.name}
          </h1>
          {/* Rest of your JSX remains the same */}
        </div>
      </div>
    </div>
  );
}