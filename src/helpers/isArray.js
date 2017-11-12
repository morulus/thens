export default function isArray(arrayLike) {
  return typeof arrayLike === 'object' && arrayLike instanceof Array;
}