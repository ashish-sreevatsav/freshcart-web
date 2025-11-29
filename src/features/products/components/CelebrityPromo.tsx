import { Star, ShoppingBag } from 'lucide-react';

export function CelebrityPromo() {
  const celebrities = [
    {
      id: 1,
      name: 'Chef Gordon',
      role: 'Master Chef',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
      message: 'Get fresh ingredients delivered!',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Fitness Expert',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      message: 'Healthy choices, happy life!',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 3,
      name: 'Marco Silva',
      role: 'Food Influencer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      message: 'Quality groceries at best prices!',
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="mb-2">Trusted by Food Experts</h2>
        <p className="text-gray-500">Join thousands who shop with us daily</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {celebrities.map((celebrity) => (
          <div
            key={celebrity.id}
            className="relative group cursor-pointer"
          >
            <div className={`bg-gradient-to-br ${celebrity.color} rounded-2xl overflow-hidden shadow-lg transition-transform group-hover:scale-105`}>
              {/* Image */}
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={celebrity.image}
                  alt={celebrity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Star Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">Featured</span>
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-white mb-1">{celebrity.name}</h3>
                <p className="text-sm text-white/80 mb-3">{celebrity.role}</p>
                <p className="text-sm mb-4 italic">"{celebrity.message}"</p>
                {/* <button className="w-full bg-white text-gray-900 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm">Book Now</span>
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Large Promotional Banner */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl overflow-hidden shadow-xl mt-8">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -ml-36 -mb-36" />
        </div>
        
        <div className="relative z-10 px-8 py-12 md:px-16 md:py-16 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <p className="text-sm">🎉 Special Offer</p>
            </div>
            <h2 className="text-white mb-4">Join FreshCart Premium Today!</h2>
            <p className="text-lg text-white/90 mb-8">
              Get exclusive deals, free delivery, and early access to sales. 
              Save up to 30% on your monthly grocery bills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-colors">
                Start Free Trial
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl hover:bg-white/20 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
