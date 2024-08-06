import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { drizzle } from "drizzle-orm/d1";
import { resources } from "app/drizzle/schema.server";

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { doTheAuthThing } from "lib/authThing";
import { Navbar } from "./navbar";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://bbe111b6726945b110b32ab037e4c232.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: "e74dc595a3b18668b5e9f6795929cf3c",
    secretAccessKey:
      "b3c68d4ced82ad17a964d22648266c0a0b6fc55d0cf8b5f775e1183b4616b065",
  },
});

// This function fetches resources from D1 and images from R2
export async function loader({ request, context }: LoaderFunctionArgs) {
  // call this at the top of all your loaders that need auth and db
  const { user, session, db } = await doTheAuthThing({ request, context });
  // now you just have to condition all these queires on the user id
  if (user) {
    const userId = user.id;
    console.log("LOGGED IN!!");
    //      ^ type: string
  } else {
    console.log("NOT LOGGED IN!!");
  }
  const resourceList = await db
    .select({
      id: resources.id,
      title: resources.title,
      href: resources.href,
    })
    .from(resources)
    .orderBy(resources.id);

  const { Contents } = await S3.send(
    new ListObjectsV2Command({ Bucket: "artworks" })
  );

  const imageList = await Promise.all(
    Contents?.map(async (file) => {
      if (file.Key) {
        return getSignedUrl(
          S3,
          new GetObjectCommand({
            Bucket: "artworks",
            Key: file.Key,
          }),
          { expiresIn: 3600 }
        ); // Expires in 1 hour
      }
      return null;
    }) || []
  );

  console.log(await S3.send(new ListObjectsV2Command({ Bucket: "artworks" })));
  return json({
    user,
    resourceList,
    imageList: imageList.filter((url) => url !== null), // Pass the list of signed image URLs to the frontend
  });
}

export default function Index() {
  const { user, resourceList, imageList } = useLoaderData<typeof loader>();

  return (
    <div className="w-full max-w-[1440px] mx-auto p-8">
      <Navbar user={user} />
      <Outlet />

      {/* <ul>
        {imageList.map((url, index) => (
          <li key={index}>
            <img
              src={url}
              alt={`Artwork ${index}`}
              style={{ width: "100%", height: "auto" }}
            />
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const db = drizzle(context.cloudflare.env.DB);

  // Handle resource addition
  const title = formData.get("title");
  const href = formData.get("href");
  if (title && href) {
    await db
      .insert(resources)
      .values({ title: title as string, href: href as string })
      .execute();
    return json({ message: "Resource added" }, { status: 201 });
  }

  // Handle image upload
  const file = formData.get("image");
  if (file instanceof File) {
    // Prepare the payload for the S3 upload
    const fileStream = file.stream();
    const fileName = file.name;
    const fileType = file.type;

    try {
      await S3.send(
        new PutObjectCommand({
          Bucket: "artworks", // Specify your S3 bucket name
          Key: fileName,
          Body: fileStream,
          ContentType: fileType,
        })
      );
      return json(
        { message: "Image uploaded to S3 successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.error("Failed to upload to S3", error);
      return json({ message: "Failed to upload image" }, { status: 500 });
    }
  }

  return json({ message: "No operation performed" }, { status: 400 });
}
