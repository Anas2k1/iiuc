import { Navigation } from "@/components/ui/navigation";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-6">About</h1>
        <p className="mb-8 text-lg text-muted-foreground">Learn more about the IIUC Room Booking System.</p>
        <div className="bg-background rounded-lg shadow p-8 text-center text-muted-foreground">
          This system helps students and staff book rooms efficiently at IIUC. More info coming soon.
        </div>
      </main>
    </div>
  );
};

export default About;
