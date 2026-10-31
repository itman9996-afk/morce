export function SimpleWhiteDivider() {
  return (
    <div className="relative h-24 w-full bg-white border-y border-gray-100">
      {/* یک خط بسیار ظریف برای جداسازی تمیز */}
      <div className="absolute top-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 bg-gray-200" />
    </div>
  );
}