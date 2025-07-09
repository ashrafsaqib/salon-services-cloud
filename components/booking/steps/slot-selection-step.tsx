"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SlotSelectionStepProps {
  groups: any[];
  services: any[];
  selectedSlots: { [groupIdx: number]: { slot: any; staff: any } };
  onSlotSelect: (groupIdx: number, slot: any, staff: any) => void;
}

export function SlotSelectionStep({
  groups,
  services,
  selectedSlots,
  onSlotSelect,
}: SlotSelectionStepProps) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Time Slot
        </h2>
        <p className="text-gray-600">
          Choose your preferred time and professional for each service group
        </p>
      </div>
      {groups.map((group, idx) => {
        // Find service details for this group
        const groupServices = (group.services || [])
          .map((sid: number) => services.find((s: any) => s.id === sid))
          .filter(Boolean);
        const selected = selectedSlots[idx] || {};
        return (
          <Card key={idx} className="border-2 border-rose-100">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="font-semibold text-lg text-rose-700 mb-1">
                  Service{groupServices.length > 1 ? "s" : ""}:
                </div>
                <ul className="list-disc ml-6 text-gray-800">
                  {groupServices.map((svc: any) => (
                    <li key={svc.id}>
                      <span className="font-bold">{svc.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(group.slots || []).map((slot: any) =>
                  (slot.staff || []).map((staff: any) => (
                    <Button
                      key={slot.id + "-" + staff.id}
                      variant={
                        selected.slot?.id === slot.id &&
                        selected.staff?.id === staff.id
                          ? "default"
                          : "outline"
                      }
                      onClick={() => onSlotSelect(idx, slot, staff)}
                      className={`p-0 h-auto rounded-xl shadow-sm border transition-all flex-col items-stretch text-left overflow-hidden ${
                        selected.slot?.id === slot.id &&
                        selected.staff?.id === staff.id
                          ? "ring-2 ring-rose-500 bg-rose-50"
                          : "hover:bg-rose-50 hover:border-rose-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 border-b">
                        <Image
                          src={staff.image || "/placeholder-user.jpg"}
                          alt={staff.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover border"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 text-base">
                            {staff.name}
                          </div>
                          {staff.sub_title && (
                            <div className="text-xs text-gray-500">
                              {staff.sub_title}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center px-4 py-5">
                        <div className="font-bold text-xl text-gray-900 mb-1">
                          {slot.time_start}
                        </div>
                        {selected.slot?.id === slot.id &&
                          selected.staff?.id === staff.id && (
                            <div className="mt-2 text-xs text-rose-600 font-semibold">
                              Selected
                            </div>
                          )}
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
