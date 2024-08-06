import { Button } from "~/components/ui/button";
import { useNavigate } from "@remix-run/react";

import profile from "/profile.png";
import des from "/des.png";
import nails from "/nails.png";
import senay from "/senay.png";
import nyah from "/nyah.png";
import west from "/west.png";

// Define types
interface ServiceCardProps {
  title: string;
  description: string;
  rating: number;
  image: string;
  id: string;
}

interface ServiceData extends ServiceCardProps {}

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
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="mt-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">★</span>
          <span className="ml-1">{rating.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function Explore() {
  const navigate = useNavigate();

  const buttonRoutes: Record<string, string> = {
    All: "/explore/all",
    "Hair Care": "/explore/hair-care",
    Tutoring: "/explore/tutoring",
    Art: "/explore/art",
    Food: "/explore/food",
    "Fix-It": "/explore/fix-it",
  };

  const servicesData: ServiceData[] = [
    {
      title: "West Campus Cuts",
      description:
        "Your friendly neighborhood barbershop. I've been cutting hair for 3 years now and I specialize in fades, tapers, or lineups. Please come with hair washed and dry. Check out my Calendly to book an appointment!",
      rating: 4.92,
      image: west,
      id: "west",
    },
    {
      title: "Done by Des",
      description:
        "Redefining hair care at Stanford. Natural styles, Men's Twists, Wig installs, Butterfly Locs, Braid Touch-ups, Loc Retwists, Cornrows, I do it all. Hope to see you soon!",
      rating: 5.0,
      image: des,
      id: "des",
    },
    {
      title: "Nails by Ari",
      description:
        "On-campus nail studio specializing in trendy designs, long-lasting gels, and quick touch-ups.",
      rating: 4.85,
      image: nails,
      id: "nails",
    },
    {
      title: "SenayDani.img",
      description:
        "Turning my photography hobby into a side hustle. Covering everything from club events to couples' shoots. Known for vibrant edits and chill vibes during sessions.",
      rating: 4.76,
      image: senay,
      id: "senay",
    },
    {
      title: "NyahWitDaNikon",
      description:
        "Obsessed with street photography and finding beauty in the everyday. Always have my trusty Nikon on hand.",
      rating: 4.8,
      image: nyah,
      id: "nyah",
    },
  ];

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
            // onClick={() => handleButtonClick(route)}
            className="px-8 py-6 mb-2 text-md"
          >
            {name}
          </Button>
        ))}
      </div>
      {/* Profile grid  */}
      <div className="w-full flex">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
}
