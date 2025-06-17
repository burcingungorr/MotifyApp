export interface RegisterButtonProps {
  onPress: () => void;
  disabled: boolean;
}
export type LoginInputProps = {
  email: string;
  password: string;
  error: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
};
export type LoginButtonProps = {
  onPress: () => void;
};
