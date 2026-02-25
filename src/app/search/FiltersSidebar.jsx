"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MultiSelectFilter from "@/app/components/MultiSelectFilter";

export default function FiltersSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  // 🔹 Fetch all filters in one call
  useEffect(() => {
    const fetchFilters = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/search/filters`,
      );
      const data = await res.json();

      setCategories(data.categories || []);
      setCountries(data.countries || []);
      setCities(data.cities || []);
      setStates(data.states || []);
    };

    fetchFilters();
  }, []);

  const getMultiValues = (key) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  const updateMultiFilter = (key, values) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!values || values.length === 0) {
      params.delete(key);
    } else {
      params.set(key, values.join(","));
    }

    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  const handleResetFilters = () => {
  const params = new URLSearchParams();

  const q = searchParams.get("q");

  if (q) {
    params.set("q", q);
  }

  router.push(`/search?${params.toString()}`);
};

  const updateSingleFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) params.delete(key);
    else params.set(key, value);

    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  const selectedCategories = getMultiValues("category");
  const selectedCountries = getMultiValues("country");
  const selectedCities = getMultiValues("city");
  const selectedServiceTypes = getMultiValues("serviceType");
  const selectedPricingModels = getMultiValues("pricingModel");
  const selectedStates = getMultiValues("state");

  const serviceTypes = ["one_time", "ongoing", "consultation", "project_based"];

  const pricingModels = ["fixed", "hourly", "daily", "custom_quote"];

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-6">
      {/* CATEGORY */}
      <MultiSelectFilter
        title="Category"
        options={categories.map((c) => ({
          label: c.category_name,
          value: String(c.category_id),
        }))}
        selectedValues={selectedCategories}
        onChange={(vals) => updateMultiFilter("category", vals)}
      />

      {/* COUNTRY */}
      <MultiSelectFilter
        title="Country"
        options={countries.map((c) => ({
          label: c,
          value: c,
        }))}
        selectedValues={selectedCountries}
        onChange={(vals) => updateMultiFilter("country", vals)}
      />
      {/* State */}
      <MultiSelectFilter
        title="State"
        options={states.map((s) => ({
          label: s,
          value: s,
        }))}
        selectedValues={selectedStates}
        onChange={(vals) => updateMultiFilter("state", vals)}
      />

      {/* CITY */}
      <MultiSelectFilter
        title="City"
        options={cities.map((c) => ({
          label: c,
          value: c,
        }))}
        selectedValues={selectedCities}
        onChange={(vals) => updateMultiFilter("city", vals)}
      />

      {/* SERVICE TYPE */}
      <MultiSelectFilter
        title="Service Type"
        options={serviceTypes.map((s) => ({
          label: s.replace("_", " "),
          value: s,
        }))}
        selectedValues={selectedServiceTypes}
        onChange={(vals) => updateMultiFilter("serviceType", vals)}
      />

      {/* PRICING MODEL */}
      <MultiSelectFilter
        title="Pricing Model"
        options={pricingModels.map((p) => ({
          label: p.replace("_", " "),
          value: p,
        }))}
        selectedValues={selectedPricingModels}
        onChange={(vals) => updateMultiFilter("pricingModel", vals)}
      />

      {/* PRICE RANGE */}
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());

            if (minPrice) params.set("minPrice", minPrice);
            else params.delete("minPrice");

            if (maxPrice) params.set("maxPrice", maxPrice);
            else params.delete("maxPrice");

            params.set("page", "1");
            router.push(`/search?${params.toString()}`);
          }}
          className="mt-2 w-full bg-indigo-600 text-white py-1 rounded"
        >
          Apply
        </button>
      </div>

      {/* FEATURED + VERIFIED */}
      <div className="space-y-2">
        <label className="block text-sm">
          <input
            type="checkbox"
            checked={searchParams.get("featured") === "true"}
            onChange={() =>
              updateSingleFilter(
                "featured",
                searchParams.get("featured") === "true" ? "" : "true",
              )
            }
            className="mr-2"
          />
          Featured Only
        </label>

        <label className="block text-sm">
          <input
            type="checkbox"
            checked={searchParams.get("verified") === "true"}
            onChange={() =>
              updateSingleFilter(
                "verified",
                searchParams.get("verified") === "true" ? "" : "true",
              )
            }
            className="mr-2"
          />
          Verified Sellers Only
        </label>
      </div>

      {/* SORT */}
      <div>
        <h3 className="font-semibold mb-2">Sort By</h3>
        <select
          value={searchParams.get("sort") || ""}
          onChange={(e) => updateSingleFilter("sort", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Relevance</option>
          <option value="price_asc">Price Low → High</option>
          <option value="price_desc">Price High → Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="mt-6 border-t pt-4">
        <button
          onClick={handleResetFilters}
          className="w-full py-2 px-4 border border-red-300 text-red-600 rounded hover:bg-red-50 transition"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
}
