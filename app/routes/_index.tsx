import { Link } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Index() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="w-full max-w-8xl space-y-6 py-40">
        <div className="text-center">
          <h1 className="text-8xl font-bold mb-2">
            Connecting the Stanford gig economy.
          </h1>
          <p className="text-gray-600">
            Discover or create opportunities within Stanford's network of
            talented students
          </p>
        </div>
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="absolute top-4 right-4">
          <Button variant="ghost">Log in</Button>
        </div>

        <div className="flex items-center space-x-2">
          <Input type="email" placeholder="Email" className="flex-grow" />
          <Button>Join Waitlist!</Button>
        </div>
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
