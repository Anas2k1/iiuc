import { Navigation } from "@/components/ui/navigation";

const Rooms = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-6">Rooms</h1>
        <p className="mb-8 text-lg text-muted-foreground">Browse all available rooms and their details.</p>
        {/* TODO: Add RoomGrid or room list here */}
        <div className="bg-background rounded-lg shadow p-8 text-center text-muted-foreground">
          Room listing coming soon.
        </div>
      </main>
    </div>
  );
};

export default Rooms;
