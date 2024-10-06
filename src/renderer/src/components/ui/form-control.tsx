import { cn } from "@lib/utils";
import { FC } from "react";

export type FormControlProps = {
  name?: string;
  label: string;
} & React.PropsWithChildren &
  React.LabelHTMLAttributes<HTMLLabelElement>;
export const FormControl: FC<FormControlProps> = ({
  name,
  label,
  children,
  className,
}) => {
  return (
    <label
      htmlFor={name}
      className={cn("form-control w-full", className)}
    >
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      {children}
    </label>
  );
};
