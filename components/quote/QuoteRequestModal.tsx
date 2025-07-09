import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Select from "react-select";
import { getUserIdFromStorage } from "@/lib/storage";
import PhoneInputWithCountry from "../ui/phone-input-with-country";

interface ServiceOption {
  id: number;
  option_name: string;
}

interface QuoteRequestModalProps {
  open: boolean;
  onClose: () => void;
  serviceId: number;
  serviceName: string;
  serviceOptions: ServiceOption[];
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  open,
  onClose,
  serviceId,
  serviceName,
  serviceOptions,
}) => {
  const [form, setForm] = useState({
    detail: "",
    user_id: "",
    guest_name: "",
    guest_email: "",
    phone: "",
    whatsapp: "",
    sourcing_quantity: 1,
    affiliate_code: "",
    location: "",
    zone: "",
    service_option_id: [] as number[],
    images: [] as File[],
  });
  const [dragActive, setDragActive] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasUserId, setHasUserId] = useState(false);
  const [zoneName, setZoneName] = useState<string>("");
  const [zoneList, setZoneList] = useState<{ value: string; label: string }[]>(
    []
  );

  // Helper to add images without duplicates (by name)
  const addImages = (files: FileList | File[]) => {
    setForm((prev) => {
      const existingNames = prev.images.map((img) => img.name);
      const newFiles = Array.from(files).filter(
        (file) => !existingNames.includes(file.name)
      );
      return { ...prev, images: [...prev.images, ...newFiles] };
    });
  };

  // Helper to reset form
  const resetForm = (userId?: string) => {
    setForm({
      detail: "",
      user_id: userId || "",
      guest_name: "",
      guest_email: "",
      phone: "",
      whatsapp: "",
      sourcing_quantity: 1,
      affiliate_code: "",
      location: "",
      zone: "",
      service_option_id: [],
      images: [],
    });
  };

  // On open, set user_id and zone if present and reset form
  React.useEffect(() => {
    const userId = getUserIdFromStorage();
    const zone = localStorage.getItem("selected_zone_name") || "";
    setZoneName(zone);
    setHasUserId(!!userId);
    setForm((prev) => ({
      ...prev,
      user_id: userId || "",
    }));
  }, [open]);

  // Reset form on modal close
  React.useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  // Fetch zones on load
  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/zones`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.zones)) {
          setZoneList(
            data.zones.map((z: any) => ({
              value: z.id,
              label: z.name,
            }))
          );
          // If zoneName exists, set form.zone to the matching zone id
          if (zoneName) {
            const found = data.zones.find((z: any) => z.name === zoneName);
            if (found) {
              setForm((prev) => ({ ...prev, zone: found.id }));
            }
          }
        }
      });
  }, [zoneName]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImages(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImages(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = (name: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.name !== name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const formData = new FormData();
    formData.append("service_id", String(serviceId));
    formData.append("service_name", serviceName);
    formData.append("detail", form.detail);
    formData.append("user_id", form.user_id);
    formData.append("guest_name", form.guest_name);
    formData.append("guest_email", form.guest_email);
    formData.append("phone", form.phone);
    formData.append("whatsapp", form.whatsapp);
    formData.append("sourcing_quantity", String(form.sourcing_quantity));
    formData.append("affiliate_code", form.affiliate_code);
    formData.append("location", form.location);
    formData.append("zone", form.zone);
    form.service_option_id.forEach((id) =>
      formData.append("service_option_id[]", String(id))
    );
    form.images.forEach((file) => formData.append("images", file));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quote/store`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json().catch(() => ({}));
    if (data?.success) {
      sessionStorage.setItem(
        "flashMessage",
        data?.message || "Your quote request was submitted successfully."
      );
      window.location.reload(); // or use router.push() if using Next.js router
      return;
    } else if (res.status === 400) {
      setSubmitError(
        data?.message || "Something went wrong. Please check your input."
      );
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Request a Quote
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="text-red-600 text-sm font-medium mb-2">
              {submitError}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-gray-700">Service</Label>
            <Input value={serviceName} disabled className="bg-gray-100" />
          </div>

          {serviceOptions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-700">Service Options</Label>
              <Select
                isMulti
                options={serviceOptions.map((opt) => ({
                  value: opt.id,
                  label: opt.option_name,
                }))}
                value={serviceOptions
                  .filter((opt) => form.service_option_id.includes(opt.id))
                  .map((opt) => ({
                    value: opt.id,
                    label: opt.option_name,
                  }))}
                onChange={(selected) => {
                  setForm((prev) => ({
                    ...prev,
                    service_option_id: Array.isArray(selected)
                      ? selected.map((s) => s.value)
                      : [],
                  }));
                }}
                classNamePrefix="react-select"
                placeholder="Select one or more options..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-gray-700">Project Details</Label>
            <Textarea
              name="detail"
              className="min-h-[100px]"
              value={form.detail}
              onChange={handleChange}
              placeholder="Tell us more about your requirements..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!hasUserId && (
              <>
                <div className="space-y-2">
                  <Label className="text-gray-700">Full Name</Label>
                  <Input
                    name="guest_name"
                    value={form.guest_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Email</Label>
                  <Input
                    name="guest_email"
                    type="email"
                    value={form.guest_email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label className="text-gray-700">Phone</Label>
              <PhoneInputWithCountry
                value={form.phone}
                onChange={(value) => {
                  const phoneWithPlus = value.startsWith("+")
                    ? value
                    : `+${value}`;
                  setForm((prev) => ({ ...prev, phone: phoneWithPlus }));
                  console.log("Phone changed:", phoneWithPlus);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">WhatsApp</Label>
              <PhoneInputWithCountry
                value={form.whatsapp}
                onChange={(value) => {
                  const whatsappWithPlus = value.startsWith("+")
                    ? value
                    : `+${value}`;
                  setForm((prev) => ({ ...prev, whatsapp: whatsappWithPlus }));
                  console.log("WhatsApp changed:", whatsappWithPlus);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Location</Label>
              <Input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Zone/Area</Label>
              <Select
                options={zoneList}
                value={zoneList.find((z) => z.value === form.zone) || null}
                onChange={(selected) =>
                  setForm((prev) => ({
                    ...prev,
                    zone: selected ? selected.value : "",
                  }))
                }
                // isDisabled={!!zoneName}
                classNamePrefix="react-select"
                placeholder="Select zone/area..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Quantity</Label>
              <Input
                name="sourcing_quantity"
                type="number"
                min={1}
                value={form.sourcing_quantity}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Affiliate Code</Label>
              <Input
                name="affiliate_code"
                value={form.affiliate_code}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Upload Images</Label>
            <div
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 cursor-pointer transition-colors ${
                dragActive
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-300 bg-white"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() =>
                document.getElementById("image-upload-input")?.click()
              }
            >
              <input
                id="image-upload-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-gray-500 text-sm">
                Drag & drop or click to select images
              </span>
            </div>
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {form.images.map((file) => (
                  <div key={file.name} className="relative w-20 h-20">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover rounded shadow"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(file.name)}
                      className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
