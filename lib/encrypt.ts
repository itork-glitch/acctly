import bcrypt from 'bcrypt';

interface Username {
  username: string;
  firstName: string;
  lastName: string;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password function
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.includes('@');
};

export const isValidPassword = (password: string): boolean => {
  const minLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return minLength && hasNumber && hasSpecial;
};

export const isValidUsername = (
  username: string,
  firstName: string,
  lastName: string
) => {
  const isWithinLength = (str: string, min: number, max: number): boolean =>
    str.length >= min && str.length <= max;

  const isAlphabetic = (str: string): boolean => /^[A-Za-z]+$/.test(str);

  const isUsernameValidChars = (str: string): boolean =>
    /^[a-zA-Z0-9_]+$/.test(str);

  const hasValidLength =
    isWithinLength(username, 2, 20) &&
    isWithinLength(firstName, 2, 30) &&
    isWithinLength(lastName, 2, 30);

  const hasValidCharacters =
    isAlphabetic(firstName) &&
    isAlphabetic(lastName) &&
    isUsernameValidChars(username);

  return hasValidLength && hasValidCharacters;
};
