import { Navigation } from "@/components/ui/navigation";

const Bookings = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-6">My Bookings</h1>
        <p className="mb-8 text-lg text-muted-foreground">View and manage your room bookings.</p>
        {/* TODO: Add booking list or management UI here */}
        <div className="bg-background rounded-lg shadow p-8 text-center text-muted-foreground">
          Booking management coming soon.
        </div>
      </main>
    </div>
  );
};

export default Bookings;
