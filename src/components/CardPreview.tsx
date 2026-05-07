import { detectCardType, maskCardNumber } from "@/utils/cardUtils";

interface CardPreviewProps {
  number: string;
  name: string;
  expiry: string;
}

const brandLabels = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMEX",
  unknown: "",
};

export const CardPreview = ({ number, name, expiry }: CardPreviewProps) => {
  const brand = detectCardType(number);

  const getCardBg = () => {
    if (brand === "visa") return "bg-gradient-to-br from-blue-700 to-blue-900";
    if (brand === "amex")
      return "bg-gradient-to-br from-emerald-600 to-teal-800";
    if (brand === "mastercard")
      return "bg-gradient-to-br from-red-600 to-orange-800";
    return "bg-gradient-to-br from-gray-700 to-gray-900";
  };

  return (
    <div
      className={`w-full max-w-sm h-48 rounded-xl p-6 text-white shadow-2xl transition-all duration-500 ${getCardBg()}`}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="h-10 w-12 bg-yellow-400/80 rounded-md" /> {/* Chip */}
        <span className="font-bold italic text-xl">
          {brand !== "unknown" ? brandLabels[brand] : "Card"}
        </span>
      </div>

      <div className="text-xl tracking-widest mb-4 font-mono">
        {maskCardNumber(number)}
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase opacity-70">Card Holder</p>
          <p className="font-medium tracking-wide">{name || "YOUR NAME"}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase opacity-70">Expires</p>
          <p className="font-medium">{expiry || "MM/YY"}</p>
        </div>
      </div>
    </div>
  );
};
