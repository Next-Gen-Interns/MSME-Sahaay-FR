"use client";

import { useEffect, useState } from "react";

export default function AdminExpertsPage() {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const perPage = 5;

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/experts`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setExperts(data);
  };

  const updateStatus = async (id, action) => {
    const token = localStorage.getItem("token");

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/experts/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      }
    );

    fetchExperts();
  };

  const filtered = experts.filter((e) =>
    e.seller?.user?.fullname
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="p-6 relative">
      <h1 className="text-xl font-semibold mb-6">
        Expert Management
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search expert by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-5 px-4 py-2 border rounded text-sm w-80"
      />

      {/* Table */}
      <div className="bg-white border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Fee</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((expert) => (
              <tr key={expert.expert_id} className="border-t">
                <td className="p-3">
                  {expert.seller?.user?.fullname}
                </td>

                <td className="p-3">{expert.category}</td>

                <td className="p-3">
                  ₹ {expert.consultation_fee}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      expert.is_verified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {expert.is_verified
                      ? "Verified"
                      : "Pending"}
                  </span>
                </td>

                <td className="p-3 flex gap-2">

                  {/* Toggle */}
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expert.is_verified}
                      onChange={() =>
                        updateStatus(
                          expert.expert_id,
                          expert.is_verified
                            ? "unverify"
                            : "approve"
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-checked:bg-green-600 rounded-full relative transition">
                      <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-4"></div>
                    </div>
                  </label>

                  {/* Reject */}
                  <button
                    onClick={() =>
                      updateStatus(
                        expert.expert_id,
                        "reject"
                      )
                    }
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded"
                  >
                    Reject
                  </button>

                  {/* View */}
                  <button
                    onClick={() =>
                      setSelectedExpert(expert)
                    }
                    className="px-3 py-1 bg-gray-800 text-white text-xs rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No experts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 text-sm rounded ${
              page === i + 1
                ? "bg-[var(--color-accent-700)] text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Drawer */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="bg-white w-96 h-full p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              Expert Details
            </h2>

            <p><strong>Name:</strong> {selectedExpert.seller?.user?.fullname}</p>
            <p><strong>Email:</strong> {selectedExpert.seller?.user?.email}</p>
            <p><strong>Category:</strong> {selectedExpert.category}</p>
            <p><strong>Fee:</strong> ₹ {selectedExpert.consultation_fee}</p>
            <p><strong>Experience:</strong> {selectedExpert.experience_years} yrs</p>
            <p className="mt-3"><strong>Bio:</strong></p>
            <p className="text-sm text-gray-600">
              {selectedExpert.bio}
            </p>

            <button
              onClick={() => setSelectedExpert(null)}
              className="mt-6 px-4 py-2 bg-gray-800 text-white rounded text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}