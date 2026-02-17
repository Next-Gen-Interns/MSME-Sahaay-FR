"use client";
import { useRef } from "react";
import { useState, useEffect, React } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getAllCategories } from "../api/homeAPI";

const makeSlug = (name) =>
  String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Color palette for cards
  const colorPalettes = [
    { bg: 'bg-blue-100', text: 'text-blue-800' },
    { bg: 'bg-purple-100', text: 'text-purple-800' },
    { bg: 'bg-green-100', text: 'text-green-800' },
    { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    { bg: 'bg-pink-100', text: 'text-pink-800' },
    { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    { bg: 'bg-red-100', text: 'text-red-800' },
    { bg: 'bg-teal-100', text: 'text-teal-800' },
  ];

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await getAllCategories();
        const payload = res?.data?.data ?? res?.data ?? res ?? [];
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];

        // Filter out categories named "Other" (case insensitive)
        const filteredList = (list || []).filter(
          (category) => category.name?.toLowerCase() !== "other"
        );

        const mapped = filteredList.map((c, index) => ({
          id: c.id,
          name: c.name,
          description: c.description || `Explore professional ${c.name.toLowerCase()} services`,
          image: c.image || getFallbackImage(),
          listing_count: c.listing_count ?? c.listings_count ?? Math.floor(Math.random() * 2000) + 500,
          slug: makeSlug(c.name),
          color: colorPalettes[index % colorPalettes.length].bg,
          textColor: colorPalettes[index % colorPalettes.length].text,
        }));

        if (mounted) {
          setCategories(mapped);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        if (mounted) {
          setError(err.message || "Failed to load categories");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const getFallbackImage = () => {
    const images = [
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const handleCardClick = (category) => {
    // Redirect directly to subcategories page - NO MODAL
    router.push(`/categories/${category.slug}/${category.id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedCategory(null);
    }, 300);
  };

  const openCategory = (cat) => {
    router.push(`/categories/${cat.slug}/${cat.id}`);
  };

  const totalListings = categories.reduce((sum, cat) => sum + (cat.listing_count || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-600 mx-auto mb-4" />
          <div className="text-gray-700 font-semibold">Loading Categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 p-4 md:p-8">
        <header className="mb-8 md:mb-12 text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
          >
            Categories 
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Browse through our professional service categories. Click on any category to explore detailed listings.
          </motion.p>
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </header>

        <main className="max-w-7xl mx-auto">
          {/* Desktop Layout - 4 columns with varying row heights */}
          <div className="hidden md:grid grid-cols-4 gap-4 md:gap-6 min-h-[600px]">
            {/* Column 1 - 2 cards: Full layout (image + title + description + click to explore + arrow) */}
            <div className="col-span-1 grid grid-rows-2 md:gap-6">
              {categories[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="row-span-1"
                >
                  <FullLayoutCard 
                    category={categories[0]}
                    onClick={() => handleCardClick(categories[0])}
                  />
                </motion.div>
              )}
              
              {categories[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="row-span-1"
                >
                  <FullLayoutCard 
                    category={categories[1]}
                    onClick={() => handleCardClick(categories[1])}
                  />
                </motion.div>
              )}
            </div>

            {/* Column 2 - 3 cards: Simple layout (image + title only) */}
            <div className="col-span-1 grid grid-rows-3 gap-4 md:gap-6">
              {categories[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="row-span-1"
                >
                  <SimpleLayoutCard 
                    category={categories[2]}
                    onClick={() => handleCardClick(categories[2])}
                  />
                </motion.div>
              )}
              
              {categories[3] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="row-span-1"
                >
                  <SimpleLayoutCard 
                    category={categories[3]}
                    onClick={() => handleCardClick(categories[3])}
                  />
                </motion.div>
              )}
              
              {categories[4] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="row-span-1"
                >
                  <SimpleLayoutCard
                    category={categories[4]}
                    onClick={() => handleCardClick(categories[4])}
                  />
                </motion.div>
              )}
            </div>

            {/* Column 3 - 2 cards: Full layout (image + title + description + click to explore + arrow) */}
            <div className="col-span-1 grid grid-rows-2 gap-4 md:gap-6">
              {categories[5] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="row-span-1"
                >
                  <FullLayoutCard 
                    category={categories[5]}
                    onClick={() => handleCardClick(categories[5])}
                  />
                </motion.div>
              )}
              
              {categories[6] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="row-span-1"
                >
                  <FullLayoutCard 
                    category={categories[6]}
                    onClick={() => handleCardClick(categories[6])}
                  />
                </motion.div>
              )}
            </div>

            {/* Column 4 - 3 cards: Simple layout (image + title only) */}
            <div className="col-span-1 grid grid-rows-3 gap-4 md:gap-6">
              {categories[7] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="row-span-1"
                >
                  <SimpleLayoutCard 
                    category={categories[7]}
                    onClick={() => handleCardClick(categories[7])}
                  />
                </motion.div>
              )}
              
              {categories[8] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="row-span-1"
                >
                  <SimpleLayoutCard 
                    category={categories[8]}
                    onClick={() => handleCardClick(categories[8])}
                  />
                </motion.div>
              )}
              
              {categories[9] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="row-span-1"
                >
                  <SimpleLayoutCard 
                    category={categories[9]}
                    onClick={() => handleCardClick(categories[9])}
                  />
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Layout - Grid (using FullLayoutCard for all) */}
          <div className="md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FullLayoutCard 
                    category={category}
                    onClick={() => handleCardClick(category)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Additional categories in rows for desktop (if more than 10) */}
          {categories.length > 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="hidden md:grid grid-cols-4 gap-6 mt-8"
            >
              {categories.slice(10, 14).map((category, index) => (
                <FullLayoutCard
                  key={category.id}
                  category={category}
                  onClick={() => handleCardClick(category)}
                />
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {categories.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-gray-600">📁</span>
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900">No Categories Available</h2>
              <p className="text-gray-700 max-w-md mx-auto">
                There are currently no categories to display.
              </p>
            </motion.div>
          )}
        </main>

        {/* REMOVED MODAL - No modal will show for any category */}
      </div>

      {/* Footer - Fixed at bottom */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white border-t border-gray-200 py-4 md:py-6"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>Click any category to view details • Total: {categories.length} categories</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

// Full Layout Card Component - For Column 1 & 3
const FullLayoutCard = ({ category, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`h-110 cursor-pointer rounded-2xl shadow-lg  md: flex flex-col justify-between transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-white hover:border-opacity-50`}
    >
      <div className="relative flex-1 flex flex-col">
        {/* Category Image */}
        {category.image && (
          <div className="mb-3 overflow-hidden rounded-xl flex-shrink-0">
            <motion.img
              src={category.image}
              alt={category.name}
              className="w-full h-64 object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
        
        <h3 className="text-lg md:text-xl font-sans px-3 line-clamp-1">{category.name}</h3>
        <p className="text-sm font-sans opacity-75 mb-2 line-clamp-2 p-3 flex-1">{category.description}</p>
        
        {/* Listing Count */}
        {/* {category.listing_count > 0 && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-white bg-opacity-30">
              {category.listing_count.toLocaleString()} listings
            </span>
          </div>
        )} */}
      </div>
      
      <div className="mt-4 border-t border-black border-opacity-20">
        <div className="flex items-center justify-between">
          <span className="text-base p-5 opacity-90">Click to explore</span>
        
        </div>
      </div>
    </motion.div>
  );
};

// Simple Layout Card Component - For Column 2 & 4
const SimpleLayoutCard = ({ category, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`h-full cursor-pointer rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl  border-2 border-transparent hover:border-white hover:border-opacity-50 overflow-hidden`}
    >
      {/* Image fills most of the card */}
      {category.image && (
        <div className="h-3/4 w-full overflow-hidden relative">
          <motion.img
            src={category.image}
            alt={category.name}
            className="w-full h-48 object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
         
        </div>
      )}
      
      {/* Title at bottom */}
      <div className="h-1/6 flex items-center justify-center ">
        <h3 className="text-lg  font-sans text-center line-clamp-2">
          {category.name}
        </h3>
      </div>
    </motion.div>
  );
};