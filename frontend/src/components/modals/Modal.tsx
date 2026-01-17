import { Icon } from "@iconify/react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = "md"
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop with Glass Blur */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col animate-scale-in`}
      >
        {/* Glass Card */}
        <div 
          className="glass-card rounded-2xl overflow-hidden flex flex-col"
          style={{
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{
              borderColor: 'rgba(229, 231, 235, 0.5)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)'
            }}
          >
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div 
                className="w-1 h-6 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)'
                }}
              />
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all group"
              aria-label="Close modal"
            >
              <Icon 
                icon="mdi:close" 
                width={24}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};