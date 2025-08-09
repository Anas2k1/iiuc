import { Navigation } from "@/components/ui/navigation";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-6">About</h1>
        <p className="mb-8 text-lg text-muted-foreground">Learn more about the IIUC Room Booking System.</p>
        <div className="bg-background rounded-lg shadow p-8 text-center text-muted-foreground">
          This system helps students and staff book rooms efficiently at IIUC. More info coming soon.<br /><br />
          <span className="font-semibold">Legend says:</span> If you ever manage to book <span className="underline">every single room</span> at IIUC at the same time, something amazing will happen—you will gain superpowers!<br />
          But remember: <span className="italic">with great booking power comes great responsibility.</span>
        </div>
      </main>
    </div>
  );
};

export default About;
