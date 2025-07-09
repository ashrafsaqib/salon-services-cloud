"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StaffCard } from "@/components/ui/staff-card";

interface Staff {
  id: string | number;
  name: string;
  role: string;
  experience: string;
  rating: number;
  specialties: string[];
  image: string;
  charges?: string;
}

export default function AllStaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/staff/all`)
      .then((res) => res.json())
      .then((data) => {
        setStaffList(Array.isArray(data.staff) ? data.staff : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center mb-8">
            All Staff
          </h1>
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              Loading...
            </div>
          ) : error ? (
            <div className="flex justify-center items-center min-h-[200px] text-red-500">
              Failed to load staff.
            </div>
          ) : staffList.length === 0 ? (
            <div className="flex justify-center items-center min-h-[200px] text-gray-500">
              No staff found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map((staff) => (
                <StaffCard key={staff.id} {...staff} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}