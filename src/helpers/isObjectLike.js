export default function isObjectLike(objectLike) {
  return typeof objectLike === 'object' || objectLike == null;
}