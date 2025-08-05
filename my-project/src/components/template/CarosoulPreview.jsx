import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, ExternalLink, PhoneCall } from "lucide-react";

// Sample data for demo
const defaultTemplateData = {
  mainBodyText: "Check out our *latest collection* of premium products! _Limited time offer_ - don't miss out!"
};

const defaultCards = [
  {
    id: 1,
    headerImageUrl: "https://picsum.photos/300/200?random=1",
    bodyText: "Premium Wireless Headphones with *noise cancellation* and _crystal clear_ sound quality.",
    footerText: "Starting from $199",
    buttons: [
      { text: "Shop Now", type: "URL" },
      { text: "Learn More", type: "PHONE_NUMBER" }
    ]
  },
  {
    id: 2,
    headerImageUrl: "https://picsum.photos/300/200?random=2",
    bodyText: "Smart Watch Series with *health monitoring* and _fitness tracking_ capabilities.",
    footerText: "Available in 3 colors",
    buttons: [
      { text: "View Details", type: "URL" },
      { text: "Call Us", type: "PHONE_NUMBER" }
    ]
  },
  {
    id: 3,
    headerImageUrl: null,
    bodyText: "Eco-friendly *sustainable products* for your home. Made with _100% recycled materials_.",
    footerText: "Free shipping worldwide",
    buttons: [
      { text: "Order Now", type: "URL" }
    ]
  },
  {
    id: 4,
    headerImageUrl: "https://picsum.photos/300/200?random=4",
    bodyText: "Professional Camera Kit with *4K recording* and _advanced stabilization_ technology.",
    footerText: "Professional grade",
    buttons: [
      { text: "Rent Now", type: "URL" },
      { text: "Buy", type: "URL" },
      { text: "Contact", type: "PHONE_NUMBER" }
    ]
  }
];

export default function CarouselPreview({ 
  templateData = defaultTemplateData, 
  cards = defaultCards 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef(null);

  function parseCustomMarkdown(htmlString) {
    if (!htmlString) return "";
    const raw = htmlString
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~(.*?)~/g, "<del>$1</del>");
    return raw;
  }

  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = 280; // Card width + margin
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
    scrollToCard(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
    scrollToCard(newIndex);
  };

  // Touch/Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Auto-detect which card is in view during scroll
  const handleScroll = () => {
    if (scrollContainerRef.current && !isDragging) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 280;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(Math.max(0, Math.min(newIndex, cards.length - 1)));
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <div className="w-full max-w-[400px] mx-auto">
        {/* iPhone Style Container */}
        <div className="bg-black rounded-[3rem] p-3 shadow-2xl max-w-sm mx-auto lg:max-w-4xl">
          <div className="bg-white rounded-[2.5rem] overflow-hidden relative">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20"></div>
            
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 pt-12 pb-2 bg-gray-50">
              <span className="text-sm font-semibold">{}</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="w-6 h-3 border border-black rounded-sm">
                  <div className="w-full h-full bg-green-500 rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* WhatsApp Header */}
            <div className="bg-green-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">WA</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">Business Store</h2>
                  <p className="text-green-100 text-xs">Online</p>
                </div>
              </div>
              <div className="text-white text-xs">
                {currentIndex + 1} of {cards.length}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-gradient-to-b from-green-50 to-white min-h-[600px] relative overflow-hidden">
              {/* Header Section */}
              <div className="p-4 bg-white border-b border-gray-100">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    🛍️ Carousel Preview
                  </h2>
                  <p className="text-sm text-gray-600">
                    Swipe horizontally to explore products
                  </p>
                </div>

                {/* Main Body Text */}
                {templateData.mainBodyText && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div
                      className="text-sm text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: parseCustomMarkdown(templateData.mainBodyText),
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Carousel Navigation */}
              <div className="flex justify-between items-center px-4 py-2 bg-white">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shadow-sm"
                  disabled={cards.length <= 1}
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                
                {/* Dots Indicator */}
                <div className="flex space-x-2">
                  {cards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToCard(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-blue-500 w-4' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shadow-sm"
                  disabled={cards.length <= 1}
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Scrollable Cards Container */}
              <div className="px-4 py-2">
                <div
                  ref={scrollContainerRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    scrollSnapType: 'x mandatory'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {cards.map((card, index) => (
                    <div
                      key={card.id}
                      className="flex-none w-64 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      {/* Card Header Image */}
                      <div className="relative">
                        {card.headerImageUrl ? (
                          <img
                            src={card.headerImageUrl}
                            alt={`Card ${index + 1}`}
                            className="w-full h-32 object-cover rounded-t-xl"
                            draggable={false}
                          />
                        ) : (
                          <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-xl flex items-center justify-center">
                            <ImageIcon size={32} className="text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                          {index + 1}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4">
                        <div className="mb-3">
                          <div
                            className="text-sm text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: parseCustomMarkdown(card.bodyText),
                            }}
                          />
                        </div>

                        {card.footerText && (
                          <div className="text-xs text-gray-500 mb-3 italic">
                            {card.footerText}
                          </div>
                        )}

                        {/* Action Buttons */}
                        {card.buttons.length > 0 && (
                          <div className="space-y-2">
                            {card.buttons.map((btn, btnIdx) => (
                              <button
                                key={btnIdx}
                                className={`w-full text-xs px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 ${
                                  btn.type === 'URL'
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                              >
                                {btn.type === 'URL' ? (
                                  <ExternalLink size={12} />
                                ) : (
                                  <PhoneCall size={12} />
                                )}
                                {btn.text}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-4 py-2">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${((currentIndex + 1) / cards.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="flex justify-center py-2 bg-white">
              <div className="w-32 h-1 bg-black rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}