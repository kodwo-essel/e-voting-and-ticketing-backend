import bcrypt from "bcrypt";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export const validatePassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
