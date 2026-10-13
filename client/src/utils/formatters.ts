export const formatDateReadable = (dateStr: string | Date | undefined): string => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(dateStr);
  }
};

export const formatDateInput = (dateStr: string | Date | undefined): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

export const calculateAge = (dateOfBirth: string | Date | undefined): number | string => {
  if (!dateOfBirth) return 'N/A';
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) return 'N/A';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 'N/A';
};
