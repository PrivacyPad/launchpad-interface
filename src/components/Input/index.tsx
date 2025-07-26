export type { IBaseInputProps as IInputProps } from "./BaseInput";
import BaseInput from "./BaseInput";
import InputNumber from "./Number";

export type TInput = typeof BaseInput & {
  Number: typeof InputNumber;
};

const Input: TInput = Object.assign(BaseInput, {
  Number: InputNumber,
});

export default Input;
