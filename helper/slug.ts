export default function () {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const upper = alphabet.toUpperCase();
  const num = '0123456789';
  const arr = [...alphabet, ...upper, ...num];
  let res = '';
  Array.from(Array(16).keys()).forEach((_) => {
    res += arr[Math.floor(Math.random() * arr.length)];
  });
  return res;
}
