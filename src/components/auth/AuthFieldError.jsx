function AuthFieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs leading-tight text-red-500">{message}</p>;
}

export default AuthFieldError;
