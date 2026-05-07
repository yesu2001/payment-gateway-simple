import { PaymentStatus } from "@/types/payment";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

export const StatusView = ({
  status,
  message,
  attemptCount,
  maxAttempts,
}: {
  status: PaymentStatus;
  message: string;
  attemptCount?: number;
  maxAttempts?: number;
}) => {
  console.log(status);
  const configs = {
    idle: {
      icon: <CheckCircle className="text-slate-500 w-16 h-16" />,
      title: "Ready to pay",
    },
    processing: {
      icon: <Loader2 className="animate-spin text-blue-500 w-16 h-16" />,
      title: "Processing payment",
    },
    success: {
      icon: <CheckCircle className="text-green-500 w-16 h-16" />,
      title: "Payment successful",
    },
    failed: {
      icon: <XCircle className="text-red-500 w-16 h-16" />,
      title: "Payment declined",
    },
    timeout: {
      icon: <AlertCircle className="text-amber-500 w-16 h-16" />,
      title: "Request timed out",
    },
  };

  const config = configs[status] || configs["processing"];

  return (
    <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
      {config.icon}
      <h2 className="text-2xl font-bold text-slate-900">{config.title}</h2>
      <p className="text-slate-600">{message}</p>
      {(status === "failed" || status === "timeout") &&
      attemptCount !== undefined &&
      maxAttempts !== undefined ? (
        <p className="text-sm text-slate-400">
          Attempt {attemptCount} of {maxAttempts}
        </p>
      ) : null}
    </div>
  );
};
