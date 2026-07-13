export const PROJECT2_IMAGE_META = {
  'project-pankou-restoration.jpg': { width: 731, height: 1024 },
  'pankou-transparent.png': { width: 1024, height: 915 },
  'repare.png': { width: 299, height: 282 },
  'Repair.png': { width: 272, height: 267 },
  'xiangao.png': { width: 923, height: 1024 },
  'moxing.png': { width: 924, height: 1024 },
  'yanse.png': { width: 345, height: 339 },
  '1.png': { width: 908, height: 906 },
  '2.png': { width: 908, height: 906 },
  '3.png': { width: 906, height: 904 },
  '4.png': { width: 944, height: 948 },
  '1.1.png': { width: 343, height: 439 },
  '1.2-transparent.png': { width: 831, height: 332 },
  '1.3.png': { width: 772, height: 1024 },
  'yizi.png': { width: 566, height: 804 },
  'panhua.png': { width: 726, height: 1024 },
  'project-aigc-jewelry.png': { width: 400, height: 598 },
} as const;

export function getProject2ImageMeta(src: string) {
  const filename = src.split('/').pop() ?? src;
  return PROJECT2_IMAGE_META[filename as keyof typeof PROJECT2_IMAGE_META];
}
