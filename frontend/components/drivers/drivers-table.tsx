"use client";

// OWNER: Saichandana · Driver components. TODO: table, add/edit modal, status toggle.

type Driver = {
  id: number;
  name: string;
  license: string;
  category: string;
  expiry: string;
  contact: string;
  completedTrips: number;
  safetyScore: number;
  status: "Available" | "On Trip" | "Off Duty" | "Suspended";
};

const drivers: Driver[] = [
  {
    id: 1,
    name: "Alex",
    license: "DL-879123",
    category: "LMV",
    expiry: "12/2029",
    contact: "9876543210",
    completedTrips: 461,
    safetyScore: 98,
    status: "Available",
  },
  {
    id: 2,
    name: "John",
    license: "DL-479420",
    category: "HMV",
    expiry: "03/2025",
    contact: "9123400000",
    completedTrips: 879,
    safetyScore: 87,
    status: "Suspended",
  },
  {
    id: 3,
    name: "Priya",
    license: "DL-77031",
    category: "LMV",
    expiry: "05/2027",
    contact: "9111000000",
    completedTrips: 499,
    safetyScore: 96,
    status: "On Trip",
  },
  {
    id: 4,
    name: "Suresh",
    license: "DL-20445",
    category: "HMV",
    expiry: "01/2027",
    contact: "9744000000",
    completedTrips: 879,
    safetyScore: 92,
    status: "Off Duty",
  },
];

function badge(status: Driver["status"]) {
  switch (status) {
    case "Available":
      return "bg-green-500 text-white";
    case "On Trip":
      return "bg-blue-500 text-white";
    case "Off Duty":
      return "bg-gray-400 text-white";
    case "Suspended":
      return "bg-orange-500 text-white";
  }
}

export function DriversTable({ search }: { search: string }) {
  const filtered = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Driver</th>
            <th className="p-3 text-left">License No</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Expiry</th>
            <th className="p-3 text-left">Contact</th>
            <th className="p-3 text-left">Trip Compl.</th>
            <th className="p-3 text-left">Safety</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((driver) => (
            <tr key={driver.id} className="border-t">
              <td className="p-3">{driver.name}</td>
              <td className="p-3">{driver.license}</td>
              <td className="p-3">{driver.category}</td>
              <td className="p-3">{driver.expiry}</td>
              <td className="p-3">{driver.contact}</td>
              <td className="p-3">{driver.completedTrips}</td>
              <td className="p-3">{driver.safetyScore}%</td>
              <td className="p-3">
                <span
                  className={`rounded-md px-3 py-1 text-xs font-medium ${badge(
                    driver.status
                  )}`}
                >
                  {driver.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
