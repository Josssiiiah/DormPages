import {
  Form,
  useActionData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import React, { useEffect, useState } from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { readFile } from "fs/promises";

import { useToast } from "~/components/ui/use-toast";
import { drizzle } from "drizzle-orm/d1";
import { owners } from "app/drizzle/schema.server";
import path from "path";

interface ServiceCardProps {
  title: string;
  description?: string;
  rating?: number;
  image?: string;
  id?: string;
  images?: string;
}

interface ServiceData extends ServiceCardProps {}

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://bbe111b6726945b110b32ab037e4c232.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: "e74dc595a3b18668b5e9f6795929cf3c",
    secretAccessKey:
      "b3c68d4ced82ad17a964d22648266c0a0b6fc55d0cf8b5f775e1183b4616b065",
  },
});

async function getFileFromPath(filePath: any) {
  const buffer = await readFile(filePath);
  const fileName = path.basename(filePath);
  return new File([buffer], fileName, { type: "image/png" });
}

const servicesData: ServiceData[] = [
  {
    title: "West Campus Cuts",
    image: "./public/west.png",
    description:
      "Your friendly neighborhood barbershop. I've been cutting hair for 3 years now and I specialize in fades, tapers, or lineups. Please come with hair washed and dry. Check out my Calendly to book an appointment!",
  },
  {
    title: "Done by Des",
    image: "./public/des.png",
    description:
      "Elevate your style with Done by Des. Specializing in custom designs and precision cuts, I bring your hair visions to life. With 5 years of experience, I offer a range of services from classic styles to trendy looks. Book now for a transformative experience!",
  },
  {
    title: "Nails by Ari",
    image: "./public/nails.png",
    description:
      "Express yourself through your nails with Ari's artistic touch. From classic manicures to intricate nail art, I've got you covered. With 4 years in the industry, I use only premium products for long-lasting results. Schedule your pampering session today!",
  },
  {
    title: "SenayDani.img",
    image: "./public/senay.png",
    description:
      "Capture life's precious moments with SenayDani.img. As a passionate photographer with 6 years of experience, I specialize in portraits, events, and lifestyle shoots. Let's create stunning visuals that tell your unique story. Book a session and let's get snappin'!",
  },
  {
    title: "NyahWitDaNikon",
    image: "./public/nyah.png",
    description:
      "Turn your memories into art with NyahWitDaNikon. With my trusty Nikon and 7 years behind the lens, I offer a fresh perspective on photography. Specializing in street, fashion, and documentary styles. Ready to see life through my viewfinder? Let's connect and create!",
  },
];

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
  const submit = useSubmit();

  const [fileName, setFileName] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
  });
  const handleSeed = () => {
    submit({ action: "seed" }, { method: "post" });
  };
  const handleClear = () => {
    submit({ action: "clear" }, { method: "post" });
  };

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
      if ("status" in actionData && actionData.status === 201) {
        toast({
          title: "Success",
          description: actionData.message,
        });
      } else if ("status" in actionData && actionData.status === 202) {
        toast({
          title: "Success",
          description: actionData.message,
        });
      }else if ("status" in actionData && actionData.status === 500) {
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
      <Button onClick={handleSeed} className="mt-4 w-full">
        Seed
      </Button>
      <Button onClick={handleClear} className="mt-4 w-full">
        Clear
      </Button>
    </div>
  );
}

export const action = async ({ request, context }: any) => {
  const db = drizzle(context.cloudflare.env.DB);
  const formData = await request.formData();

  ///////// SEED /////////
  if (formData.get("action") === "seed") {
    try {
      for (const service of servicesData) {
        const file = await getFileFromPath(service.image);
        // Generate a unique filename
        let fileName = generateUniqueFileName(file.name);
        let imageUrl = `https://bbe111b6726945b110b32ab037e4c232.r2.cloudflarestorage.com/who-profile-pictures/${fileName}`;

        if (file instanceof File) {
          const fileStream = file.stream();
          const fileType = file.type;
          const fileSize = file.size;

          // Validate file size and type
          const maxFileSizeInBytes = 10 * 1024 * 1024; // 10MB
          if (fileSize > maxFileSizeInBytes) {
            throw new Error("File size exceeds the allowed limit");
          }

          if (
            !["image/jpeg", "image/png", "application/pdf"].includes(fileType)
          ) {
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

          upload.on("httpUploadProgress", (progress) => {
            console.log(progress);
          });

          console.log("Before");
          await upload.done();
          console.log("Upload complete");
        }

        await db
          .insert(owners)
          .values({
            name: service.title,
            image_url: imageUrl,
            description: service.description,
            images: service.images,
            // Add other fields as necessary
          })
          .execute();
      }
      return json(
        { message: "Database seeded", status: 201 },
        { status: 201 }
      );
    } catch (error) {
      console.error("Failed to seed database", error);
      return json(
        { message: "Failed to seed database", status: 500 },
        { status: 500 }
      );
    }
  }

  // Check if the clear action has been triggered
  if (formData.get("action") === "clear") {
    // Perform database clear operation
    console.log("deleting database sensei...");
    await db.delete(owners);

    console.log("Database cleared");
    return json({ message: "Database cleared", status: 202 }, { status: 202 });
  }

  const fileName = formData.get("fileName");
  const imageUrl = `https://bbe111b6726945b110b32ab037e4c232.r2.cloudflarestorage.com/who-profile-pictures/${fileName}`;

  const name = formData.get("name");
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
      { message: "Image uploaded to S3 successfully", status: 203 },
      { status: 201 }
    );
  }

  return json(
    { message: "No operation performed", status: 400 },
    { status: 400 }
  );
};
