"use client";

import { ButtonProps, Button as UIButton } from "../ui/button";

export interface BaseButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const Button = ({ loading, children, loadingText, ...props }: BaseButtonProps) => {
  return (
    <UIButton {...props}>
      {loading && <span className="loading loading-spinner size-[1.2em]"></span>}
      {loading && loadingText ? loadingText : children}
    </UIButton>
  );
};
export default Button;
