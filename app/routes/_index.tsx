import { Link, useNavigate } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// Images
import profile from "/profile.png";
import explore from "/explore.png";
import create from "/create.png";

export default function Index() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/app/explore`);
  };
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="w-full max-w-8xl flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">DormPages</h1>
        <Button variant="ghost">Log in</Button>
      </div>

      <div className="w-full max-w-8xl text-center space-y-6 sm:pt-20">
        <h1 className="text-4xl sm:text-5xl font-bold">
          Discover small businesses on Stanford's campus.
        </h1>
        <p className="text-gray-600 text-sm sm:text-2xl">
          Explore, support, and be inspired by passionate student entrepreneurs
        </p>
      </div>

      <div className="w-full max-w-lg pt-10">
        <div className="flex items-center space-x-2">
          <Input
            type="email"
            placeholder="Email"
            className="sm:h-12 w-[400px] text-lg"
          />
          <Button className="sm:h-12 text-lg" onClick={handleClick}>
            Join Waitlist!
          </Button>
        </div>
      </div>

      <div className="w-full max-w-4xl flex justify-center pt-20">
        <img
          src={explore}
          alt="explore"
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
      </div>

      <div className="w-full max-w-4xl flex justify-center pt-20 sm:pt-40">
        <img
          src={profile}
          alt="profile"
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
      </div>

      <div className="w-full max-w-4xl flex justify-center pt-20 sm:pt-40">
        <img
          src={create}
          alt="create"
          className="w-full h-auto border sm:border-2 border-black object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

{
  /* <Link
to="/login"
className="px-4 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
>
Login
</Link>
<Link
to="/signup"
className="px-4 py-2 rounded bg-green-500 text-white font-medium hover:bg-green-600"
>
Sign Up
</Link>
<Link
to="/logout"
className="px-4 py-2 rounded bg-red-500 text-white font-medium hover:bg-red-600"
>
Logout
</Link>
<Link
to="/protected"
className="px-4 py-2 rounded bg-black text-white font-medium hover:bg-gray-600"
>
Protected
</Link>
<Link
to="/app"
className="px-4 py-2 rounded bg-purple-500 text-white font-medium hover:bg-purple-600"
>
App
</Link> */
}
