export default function isError(errorLike) {
  return typeof errorLike === 'object' && errorLike instanceof Error;
}