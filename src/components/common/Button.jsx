function Button({ children, type = "button", onClick, className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        w-full
        py-4
        rounded-lg
        text-white
        font-semibold
        text-lg
        bg-linear-to-r
        from-violet-600
        to-blue-400
        hover:opacity-90
        transition
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;

