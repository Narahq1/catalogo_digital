interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && <div className="mb-4 text-gray-300">{icon}</div>}
      <p className="text-sm text-gray-400 max-w-sm leading-relaxed">{message}</p>
    </div>
  );
}
