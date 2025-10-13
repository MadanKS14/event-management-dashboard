import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema using Yup
const schema = yup.object({
  name: yup.string().required("Event name is required"),
  description: yup.string().required("Description is required"),
  location: yup.string().required("Location is required"),
  date: yup.date().required("Date is required"),
});

export default function EventModal({ initialData = null, onClose, onSave }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          location: initialData.location,
          date: initialData.date
            ? initialData.date.substring(0, 10)
            : "",
        }
      : {},
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        className="bg-white rounded-lg p-6 w-[520px] shadow-lg"
        onSubmit={handleSubmit(onSave)}
      >
        <h2 className="text-xl font-semibold mb-5">
          {initialData ? "Edit Event" : "Add Event"}
        </h2>

        {/* Name */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            {...register("name")}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
            placeholder="Enter event name"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            rows="3"
            className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
            placeholder="Enter event description"
          ></textarea>
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            {...register("location")}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
            placeholder="Enter event location"
          />
          {errors.location && (
            <p className="text-sm text-red-500 mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            {...register("date")}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
          />
          {errors.date && (
            <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 rounded border"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
