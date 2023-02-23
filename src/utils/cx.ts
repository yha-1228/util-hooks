type ClassValue = string | boolean | undefined | null;

export const cx = (...classValues: ClassValue[]) => {
  return classValues.filter(Boolean).join(' ');
};
