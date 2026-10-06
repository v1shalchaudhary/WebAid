export type PasswordCheck = {
  valid: boolean;
  errors: string[];
};

export function validatePassword(password: string): PasswordCheck {
  const errors: string[] = [];

  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("One number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("One special character");

  return { valid: errors.length === 0, errors };
}
