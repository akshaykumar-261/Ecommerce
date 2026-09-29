function AuthFieldError({ message }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-0.5">{message}</p>;
}

export default AuthFieldError;
