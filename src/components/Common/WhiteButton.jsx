export default function WhiteButton({ children, className = '', ...props }) {
  return (
    <button
      className={`text-sm px-5 py-2 border border-gray-300 rounded-md text-gray-600 hover:border-gray-900 hover:text-gray-900 transition ${className} cursor-pointer disabled:opacity-50`}
      {...props}
    >
      {children}
    </button>
  );
}
