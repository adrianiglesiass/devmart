import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to: string;
  text: string;
  className?: string;
}

export function BackButton({ to, text, className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-6 group interactive-action ${className}`}
    >
      <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium">{text}</span>
    </button>
  );
}
