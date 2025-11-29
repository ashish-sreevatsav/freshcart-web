import { Tag, TrendingUp, Clock } from 'lucide-react';

export function AdBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Banner 1 - Weekend Sale */}
      <div className="relative bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />
        <div className="relative z-10">
          <Tag className="w-8 h-8 mb-3" />
          <h3 className="text-white mb-2">Weekend Sale</h3>
          <p className="text-orange-100 text-sm mb-4">
            Up to 50% off on fresh produce & dairy products
          </p>
          <button className="px-6 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
            Shop Now
          </button>
        </div>
      </div>

      {/* Banner 2 - Free Delivery */}
      <div className="relative bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />
        <div className="relative z-10">
          <div className="text-4xl mb-3">🚚</div>
          <h3 className="text-white mb-2">Free Delivery</h3>
          <p className="text-green-100 text-sm mb-4">
            Orders over $50 get free same-day delivery
          </p>
          <button className="px-6 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Banner 3 - Flash Deals */}
      <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />
        <div className="relative z-10">
          <Clock className="w-8 h-8 mb-3" />
          <h3 className="text-white mb-2">Flash Deals</h3>
          <p className="text-purple-100 text-sm mb-4">
            Hourly deals on your favorite items - Don't miss out!
          </p>
          <button className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
            View Deals
          </button>
        </div>
      </div>

      {/* Banner 4 - Best Sellers */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white overflow-hidden md:col-span-2 lg:col-span-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />
        <div className="relative z-10">
          <TrendingUp className="w-8 h-8 mb-3" />
          <h3 className="text-white mb-2">Best Sellers</h3>
          <p className="text-blue-100 text-sm mb-4">
            Shop the most popular items in your area
          </p>
          <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Explore
          </button>
        </div>
      </div>

      {/* Banner 5 - Organic Collection */}
      <div className="relative bg-gradient-to-br from-lime-600 to-green-700 rounded-2xl p-8 text-white overflow-hidden md:col-span-2">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16" />
        <div className="relative z-10">
          <div className="text-5xl mb-3">🌱</div>
          <h3 className="text-white mb-2">100% Organic Collection</h3>
          <p className="text-lime-100 text-sm mb-4">
            Premium organic products delivered fresh to your door. Farm to table in 24 hours.
          </p>
          <button className="px-6 py-2 bg-white text-lime-700 rounded-lg hover:bg-lime-50 transition-colors">
            Shop Organic
          </button>
        </div>
      </div>
    </div>
  );
}
