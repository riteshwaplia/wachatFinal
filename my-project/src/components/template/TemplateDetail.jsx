import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../../utils/api";
import Loader from "../Loader";

const TemplateDetail = () => {
  const { templateId: id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await api.get(`/templates/${id}`);
        setTemplate(response.data.data);
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <Loader />;
  if (!template)
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 text-center">
        <p className="text-gray-600">Template not found</p>
      </div>
    );

  // 🧩 Common message bubble
  const WhatsAppHeader = () => (
    <div className="p-3 bg-[#00a884] flex items-center">
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#00a884">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
        </svg>
      </div>
      <div className="ml-2 flex-1">
        <div className="text-white text-sm font-medium">Business Name</div>
        <div className="text-white text-xs opacity-80">WhatsApp Business</div>
      </div>
      <div className="text-white text-xs">
        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );

  // 🟢 Standard Template Preview
  const StandardPreview = () => (
    <div className="p-4 bg-[#e5ddd5] flex justify-center">
      <div className="bg-white rounded-lg p-3 shadow-sm w-full max-w-xs">
        {template.components?.map((component, i) => {
          switch (component.type) {
            case "HEADER":
              return (
                <div key={i} className="mb-3 font-semibold text-sm text-[#111b21]">
                  {component.text || "Header Text"}
                </div>
              );
            case "BODY":
              return (
                <div key={i} className="text-sm mb-3 whitespace-pre-line leading-tight text-[#111b21]">
                  {component.text}
                </div>
              );
            case "FOOTER":
              return (
                <div key={i} className="text-xs text-[#667781] mt-2 mb-3">
                  {component.text}
                </div>
              );
            case "BUTTONS":
              return (
                <div key={i} className="mt-3 space-y-2">
                  {component.buttons?.map((btn, j) => (
                    <div
                      key={j}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${
                        btn.type === "URL"
                          ? "bg-[#008069] text-white"
                          : "bg-[#f0f2f5] text-[#008069] border border-[#008069]"
                      }`}
                    >
                      <span className="truncate">{btn.text}</span>
                    </div>
                  ))}
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );

  // 🟣 Carousel Template Preview
  const CarouselPreview = () => {
    const carouselComponent = template.components?.find((c) => c.type === "CAROUSEL");
    if (!carouselComponent) return <StandardPreview />;

    return (
      <div className="p-4 bg-[#e5ddd5] flex justify-center">
        <div className="w-full max-w- overflow-x-auto flex space-x-3 scrollbar-hide">
          {carouselComponent.cards?.map((card, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 shadow-sm min-w-[250px] flex-shrink-0">
              {card.components.map((comp, i) => {
                switch (comp.type) {
                  case "HEADER":
                    const image = comp.example?.header_handle?.[0];
                    return (
                      <div key={i} className="mb-2">
                        {image ? (
                          <img
                            src={image}
                            alt="Header"
                            className="w-full h-28 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/250x100?text=Image+Not+Found";
                            }}
                          />
                        ) : (
                          <div className="font-semibold text-sm text-[#111b21]">
                            {comp.text || "Header"}
                          </div>
                        )}
                      </div>
                    );
                  case "BODY":
                    return (
                      <div key={i} className="text-sm mb-2 text-[#111b21] whitespace-pre-line">
                        {comp.text}
                      </div>
                    );
                  case "BUTTONS":
                    return (
                      <div key={i} className="space-y-1">
                        {comp.buttons?.map((btn, j) => (
                          <div
                            key={j}
                            className={`text-sm px-2 py-1 rounded-lg text-center cursor-pointer ${
                              btn.type === "QUICK_REPLY"
                                ? "bg-[#f0f2f5] text-[#008069]"
                                : "bg-[#008069] text-white"
                            }`}
                          >
                            {btn.text}
                          </div>
                        ))}
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#008069] hover:text-[#006653] mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span className="text-sm font-medium">Back to Templates</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WhatsApp Preview Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <WhatsAppHeader />
            {template.type === "CAROUSEL" ? <CarouselPreview /> : <StandardPreview />}
          </div>
        </div>

        {/* Metadata Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 h-fit">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Template Details</h2>
          <div className="space-y-4">
            <Detail label="Name" value={template.name} />
            <Detail label="Category" value={template.metaCategory || template.category} />
            <Detail label="Language" value={template.language?.toUpperCase()} />
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-1">Status</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.metaStatus)}`}>
                {template.metaStatus}
              </span>
            </div>
            {template.metaTemplateId && (
              <Detail label="Template ID" value={template.metaTemplateId} mono />
            )}
            <Detail label="Last Updated" value={new Date(template.updatedAt).toLocaleString()} />
            <Detail label="Created" value={new Date(template.createdAt).toLocaleString()} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value, mono }) => (
  <div>
    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</h3>
    <p className={`text-gray-800 ${mono ? "font-mono text-sm break-all" : ""}`}>{value}</p>
  </div>
);

export default TemplateDetail;
