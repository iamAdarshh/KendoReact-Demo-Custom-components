import React from "react";
import Label from "./Label";

interface RadioButtonProps {
    id?: string;
    className?: string;
    name?: string;
    label?: string;
    value?: string;
    isChecked?: boolean;
    disabled?: boolean;
    onChange?: (value?: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

function RadioButton({
    id,
    className,
    name,
    label,
    value,
    isChecked,
    disabled,
    onChange,
    onFocus,
    onBlur,
}: RadioButtonProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.stopPropagation());
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className="tw-flex tw-items-center tw-gap-1">
            <input
                id={id}
                name={name}
                type="radio"
                value={value}
                checked={isChecked}
                disabled={disabled}
                className={`tw-h-4 tw-w-4 tw-border-gray-300 tw-text-indigo-600 focus:tw-ring-indigo-600 ${className}`}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
                aria-checked={isChecked}
                aria-labelledby={id}
            />
            {label && (
                <Label htmlFor={id}>
                    {label}
                </Label>
            )}
        </div>
    );
}

export default RadioButton;
