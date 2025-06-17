'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')" }}
>
      {/* <Navbar /> */}
      <div className="flex flex-col justify-center items-center text-white text-center h-screen bg-black/50">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore the World</h1>
        <p className="text-lg md:text-xl mb-6">Welcome to our tourism website</p>
        <button onClick={() => router.push("/trips/all-trips")} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white text-lg transition-all shadow-md">
          Explore Places
        </button>
      </div>
    </div>
  );
}
