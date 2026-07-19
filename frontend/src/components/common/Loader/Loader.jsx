/**
 * Reusable Loader component.
 * Used for page loading states and route guard loading.
 */

const Loader = ({ fullScreen = false, size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} rounded-full border-primary-200 border-t-primary-600 animate-spin`}
      />
      {text && <p className="text-sm text-neutral-500 font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin" />
          <div className="text-center">
            <p className="text-lg font-semibold font-heading text-gradient">Matrimony</p>
            <p className="text-sm text-neutral-500 mt-1">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return spinner;
};

export default Loader;
