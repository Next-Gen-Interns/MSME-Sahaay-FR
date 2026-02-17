"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { getlistingfromsubcategories } from "../../../../api/homeAPI";

import {
  Package,
  ArrowLeft,
  MapPin,
  Eye,
  Star,
  Phone,
  Hand,
  X,
} from "lucide-react";


// ================= FLIP CARD =================
const FlipCard = ({ listing, router }) => {

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const bannerImage = listing.image || listing.subcategory_image;


  const handleFlip = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(!isFlipped);
    }
  };


  const handleContactClick = (e) => {
    e.stopPropagation();
    router.push(`/listings/${listing.id}`);
  };


  return (
    <div className="relative w-full h-[420px] perspective-1000">


      {/* Flip Button */}
      <motion.button
        className="
          absolute top-3 right-3 z-30
          w-10 h-10 rounded-full
          bg-white  shadow-lg
          flex items-center justify-center
        "
        onClick={handleFlip}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >

        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Hand className="w-5 h-5 text-gray-600" />
        </motion.div>

      </motion.button>


      {/* Card */}
      <motion.div
        className="relative w-full h-full rounded-xl preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{ transformPerspective: 1200 }}
        onAnimationComplete={() => setIsAnimating(false)}
      >


        {/* FRONT */}
        <div
          className="
            absolute inset-0
            backface-hidden
            bg-white rounded-xl shadow-lg
            border border-gray-200
            overflow-hidden flex flex-col
          "
        >

          {/* Image */}
          <div className="relative h-44 overflow-hidden">

            <img
              src={bannerImage}
              alt={listing.title}
              className="w-full h-full object-cover"
            />

            <div className="
              absolute top-2 left-2
              bg-white px-2 py-1
              rounded-full text-xs font-semibold
              flex gap-1
            ">
              <Eye size={13} />
              {listing.views || 0}
            </div>

          </div>


          {/* Content */}
          <div className="flex-1 p-4 flex flex-col">

            <h3 className="font-semibold text-gray-800 line-clamp-2">
              {listing.title}
            </h3>


            {/* Price */}
            <div className="mt-1 mb-2">
              <span className="text-gray-800 font-bold">
                {listing.price || "₹0"}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                /service
              </span>
            </div>


            {/* Info */}
            <div className="flex items-center gap-3 text-sm mb-2">

              <div className="flex items-center gap-1 text-gray-600">
                <MapPin size={13} />
                {listing.location?.[0] || "Remote"}
              </div>

              <div className="flex items-center gap-1 text-gray-600">
                <Star size={13} className="text-yellow-500" />
                {listing.rating || "4.5"}
              </div>

            </div>


            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2 flex-1">
              {listing.description || "Professional service available."}
            </p>

          </div>

        </div>



        {/* BACK */}
        <div
          className="
            absolute inset-0
            backface-hidden rotate-y-180
            bg-gray-50 rounded-xl shadow-lg
            border border-gray-200
          "
        >

          <div className="p-4 h-full flex flex-col">


            {/* Header */}
            <div className="flex justify-between items-center mb-3">

              <h3 className="font-bold text-gray-800 line-clamp-1">
                {listing.title}
              </h3>

              <button
                onClick={handleFlip}
                className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <X size={14} />
              </button>

            </div>


            {/* Price */}
            <div className="bg-white-600 text-gray-900 p-3 rounded-lg mb-3">

              <p className="text-xl font-bold">
                {listing.price || "₹0"}
                <span className="text-sm ml-1">/service</span>
              </p>

              <p className="text-xs opacity-90">
                All taxes included
              </p>

            </div>


            {/* Description */}
            <div className="mb-3">

              <h4 className="font-semibold text-gray-700 mb-1">
                Description
              </h4>

              <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                {listing.description || "No description available."}
              </p>

            </div>


            {/* Button */}
            <div className="mt-auto">

              <motion.button
                className="
                  w-full bg-blue-800 hover:bg-blue-900
                  text-white font-semibold py-2.5 rounded-lg
                  flex items-center justify-center gap-2
                "
                onClick={handleContactClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Phone size={16} />
                Contact
              </motion.button>

            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
};



// ================= MAIN PAGE =================

export default function SubcategoryListingsPage() {

  const { subCategoryId } = useParams();
  const router = useRouter();

  const [listings, setListings] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchListings = async () => {

      try {

        const res = await getlistingfromsubcategories(subCategoryId);

        const list = res.data?.data?.listings || [];

        setListings(list);

        if (list.length > 0) {
          setSubcategoryData({
            name: list[0].subcategory,
            image: list[0].subcategory_image,
            category: list[0].category,
          });
        }

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }

    };

    if (subCategoryId) fetchListings();

  }, [subCategoryId]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-gray-100">


      {/* ================= BANNER ================= */}
      {subcategoryData && (

        <section className="relative h-64 sm:h-80 overflow-hidden">

          <div className="absolute inset-0">

            <img
              src={subcategoryData.image}
              alt={subcategoryData.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />

          </div>


          <div className="relative h-full flex items-center justify-center text-white text-center px-4">

            <div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {subcategoryData.name}
              </h1>

              <p className="text-lg opacity-90">
                {subcategoryData.category}
              </p>

            </div>

          </div>

        </section>
      )}



      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto py-10 px-4">


        {/* Back Button */}
        <button
          onClick={() => router.push("/categories")}
          className="flex items-center gap-2 mb-8 font-semibold text-gray-800"
        >
          <ArrowLeft size={18} />
          Back to Categories
        </button>



        {/* No Data */}
        {listings.length === 0 ? (

          <div className="text-center py-20">

            <Package size={50} className="mx-auto text-gray-400 mb-4" />

            <h3 className="text-xl font-semibold mb-2">
              No Listings Found
            </h3>

            <p className="text-gray-600">
              No services available in this subcategory.
            </p>

          </div>

        ) : (

          /* Grid */
          <div
            className="
              grid gap-6
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              xl:grid-cols-4
            "
          >

            <AnimatePresence>

              {listings.map((listing, index) => (

                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >

                  <FlipCard
                    listing={listing}
                    router={router}
                  />

                </motion.div>

              ))}

            </AnimatePresence>

          </div>
        )}

      </div>

    </div>
  );
}
