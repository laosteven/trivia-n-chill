export function validateUsername(name: string): { valid: boolean; error?: string } {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return { valid: false, error: "Username cannot be empty" };
  if (trimmed.length > 20) return { valid: false, error: "Username cannot exceed 20 characters" };
  return { valid: true };
}

export function validateScore(value: number): { valid: boolean; error?: string } {
  if (!Number.isFinite(value)) return { valid: false, error: "Score must be a number" };
  if (value < 0) return { valid: false, error: "Score cannot be negative" };
  return { valid: true };
}
