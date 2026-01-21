import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  icon: string | React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type,
  placeholder,
  icon,
}) => (
  <div className="group flex flex-col gap-2">
    <Label className="text-[#0e0d1b] text-sm font-bold ml-1" htmlFor={id}>
      {label}
    </Label>
    <div className="relative">
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full h-12 px-5 rounded-xl border border-gray-200 bg-gray-50/50 text-[#0e0d1b] placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 shadow-sm"
      />
      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
        {typeof icon === 'string' ? (
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        ) : (
          icon
        )}
      </div>
    </div>
  </div>
);

export default InputField;