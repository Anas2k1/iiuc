import { Navigation } from "@/components/ui/navigation";

const Schedule = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-6">Schedule</h1>
        <p className="mb-8 text-lg text-muted-foreground">View your room booking schedule.</p>
        {/* TODO: Add schedule/calendar UI here */}
        <div className="bg-background rounded-lg shadow p-8 text-center text-muted-foreground">
          Schedule view coming soon.
        </div>
      </main>
    </div>
  );
};

export default Schedule;
