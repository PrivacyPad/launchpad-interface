"use client";

import { Loader2 } from "lucide-react";
import { ButtonProps, Button as UIButton } from "../ui/button";

export interface BaseButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

const Button = ({ loading, children, loadingText, icon, ...props }: BaseButtonProps) => {
  return (
    <UIButton {...props}>
      {loading ? <Loader2 className="size-[1.2em] animate-spin" /> : icon}
      {loading && loadingText ? loadingText : children}
    </UIButton>
  );
};
export default Button;
