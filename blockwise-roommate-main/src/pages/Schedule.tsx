import { Navigation } from "@/components/ui/navigation";
import { dummyRoutine } from "@/lib/dummyRoutine";

const Schedule = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-6">Schedule</h1>
        <p className="mb-8 text-lg text-muted-foreground">View your room booking schedule.</p>
        {/* Dynamic class routine table */}
        <div className="bg-background rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold mb-4">Class Routine (Sample)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-left">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Day</th>
                  <th className="border px-4 py-2">Time</th>
                  <th className="border px-4 py-2">Course</th>
                  <th className="border px-4 py-2">Room</th>
                  <th className="border px-4 py-2">Teacher</th>
                </tr>
              </thead>
              <tbody>
                {dummyRoutine.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-4 py-2">{item.day}</td>
                    <td className="border px-4 py-2">{item.time}</td>
                    <td className="border px-4 py-2">{item.course}</td>
                    <td className="border px-4 py-2">{item.room}</td>
                    <td className="border px-4 py-2">{item.teacher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
