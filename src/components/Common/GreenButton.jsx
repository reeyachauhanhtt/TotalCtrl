export default function GreenButton({
  children,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 text-sm rounded-md font-medium transition disabled:opacity-60 ${className} cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
}
