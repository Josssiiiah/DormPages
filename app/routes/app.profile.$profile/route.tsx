import { Link, useParams } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function Profile() {
  const { profile } = useParams();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="w-full flex flex-col p-24 relative">
        <div className="flex flex-row justify-between">
          <div className="border border-black w-64 h-48">img</div>
          <div className="border border-black w-72 h-96 absolute top-24 right-24">
            img
          </div>
        </div>
        <div className="flex flex-col space-y-6 w-full mt-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold">
            {profile}
          </h1>
          <h3 className="text-3xl">Tagline</h3>
          <div className="flex flex-row justify-between max-w-sm">
            <p className="text-xl">321 followers</p>
            <p className="text-xl">4071 likes</p>
          </div>
          <div className="flex flex-row justify-between max-w-sm">
            <Link to={"www.google.com"}>
              <Button>Follow</Button>
            </Link>
            <Link to={"www.google.com"}>
              <Button>Instagram</Button>
            </Link>
            <Link to={"www.google.com"}>
              <Button>Calendly</Button>
            </Link>
          </div>
          <div className="flex w-full border border-black">
            <h3>Description</h3>
          </div>
          <div className="flex w-full h-96 border border-black">
            <h3>Gallery</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
