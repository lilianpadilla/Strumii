export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

const INIT_NUMBER = 271;

export function hash(uuid: string, N: number) {
  const x = uuid.split("-").reduce((a,b) => a ^ Number.parseInt(b, 16), INIT_NUMBER) ;
  return arguments.length === 1 ? x : x % N;
}