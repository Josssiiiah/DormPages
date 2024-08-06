import { Form, useActionData, useNavigation } from "@remix-run/react";
import {
  json,
  unstable_parseMultipartFormData,
  unstable_createMemoryUploadHandler,
} from "@remix-run/cloudflare";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import { useToast } from "~/components/ui/use-toast";
import { doTheDbThing } from "lib/dbThing";
import { drizzle } from "drizzle-orm/d1";
import { owners } from "app/drizzle/schema.server";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://bbe111b6726945b110b32ab037e4c232.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: "e74dc595a3b18668b5e9f6795929cf3c",
    secretAccessKey:
      "b3c68d4ced82ad17a964d22648266c0a0b6fc55d0cf8b5f775e1183b4616b065",
  },
});

// Function to generate a unique name for the photo
const generateUniqueFileName = (originalName: string) => {
  const timestamp = Date.now();
  const extension = originalName.split(".").pop();
  return `profile-${timestamp}.${extension}`;
};

export default function Admin() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { toast } = useToast();

  const [fileName, setFileName] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(generateUniqueFileName(file.name));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Show toast notifications based on action data
  useEffect(() => {
    if (actionData) {
      if (actionData.status === 201) {
        toast({
          title: "Success",
          description: actionData.message,
        });
      } else if (actionData.status === 500) {
        toast({
          title: "Error",
          description: actionData.message,
        });
      }
    }
  }, [actionData, toast]);

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex w-full justify-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold pt-8">
          Admin
        </h1>
      </div>
      <Form
        method="post"
        encType="multipart/form-data"
        className="space-y-4 pt-12"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
            <Input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Name
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Business Bio
            <Input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>

        <div>
          <label
            htmlFor="instagram"
            className="block text-sm font-medium text-gray-700"
          >
            Instagram
            <Input
              type="text"
              id="instagram"
              name="instagram"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>

        <div>
          <label
            htmlFor="bookingService"
            className="block text-sm font-medium text-gray-700"
          >
            Calendly or other booking service (optional)
            <Input
              type="text"
              id="bookingService"
              name="bookingService"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>
        <input type="hidden" name="fileName" value={fileName} />

        <Button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Uploading..." : "Upload"}
        </Button>
      </Form>
      <Button>Seed</Button>
      <Button>Delete</Button>
    </div>
  );
}

export const action = async ({ request, context }: any) => {
  const db = drizzle(context.cloudflare.env.DB);
  const formData = await request.formData();

  const name = formData.get("name");
  const fileName = formData.get("fileName");
  const file = formData.get("image");
  const description = formData.get("description");

  if (file instanceof File) {
    try {
      const fileStream = file.stream();
      const fileType = file.type;
      const fileSize = file.size;

      // Validate file size and type
      const maxFileSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (fileSize > maxFileSizeInBytes) {
        throw new Error("File size exceeds the allowed limit");
      }

      if (!["image/jpeg", "image/png", "application/pdf"].includes(fileType)) {
        throw new Error("Unsupported file type");
      }

      const upload = new Upload({
        client: S3,
        params: {
          Bucket: "who-profile-pictures",
          Key: fileName as string,
          Body: fileStream,
          ContentType: fileType,
        },
        queueSize: 6,
      });

      upload.on("httpUploadProgress", (progress: any) => {
        console.log(progress);
      });

      console.log("Before");
      await upload.done();
      console.log("Upload complete");
    } catch (error) {
      console.error("Failed to upload to S3", error);
      return json(
        { message: "Failed to upload image", status: 500 },
        { status: 500 }
      );
    }

    const imageUrl = `https://bbe111b6726945b110b32ab037e4c232.r2.cloudflarestorage.com/who-profile-pictures/${fileName}`;

    await db
      .insert(owners)
      .values({
        name: name as string,
        // category: category as string,
        // description: description as string,
        image_url: imageUrl,
      })
      .execute();

    return json(
      { message: "Image uploaded to S3 successfully", status: 201 },
      { status: 201 }
    );
  }

  return json(
    { message: "No operation performed", status: 400 },
    { status: 400 }
  );
};
