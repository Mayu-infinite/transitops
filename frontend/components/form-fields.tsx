"use client";

import { useState } from "react";
import {
  Button,
  ErrorMessage,
  Input,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";

interface BaseInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  name?: string;
}

interface TextInputProps extends BaseInputProps {
  type?: "text" | "email";
}

/** Labelled text/email field built on HeroUI's react-aria TextField. */
export function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  required = false,
  disabled = false,
  error,
  name,
}: TextInputProps) {
  return (
    <TextField
      className="flex w-full flex-col gap-1.5"
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      isRequired={required}
      isDisabled={disabled}
      isInvalid={Boolean(error)}
    >
      <Label>{label}</Label>
      <Input placeholder={placeholder} />
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </TextField>
  );
}

/** Password field with a HeroUI reveal toggle. */
export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  disabled = false,
  error,
  name,
}: BaseInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      className="flex w-full flex-col gap-1.5"
      name={name}
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      isRequired={required}
      isDisabled={disabled}
      isInvalid={Boolean(error)}
    >
      <Label>{label}</Label>
      <InputGroup>
        <InputGroup.Input placeholder={placeholder} />
        <InputGroup.Suffix>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            isIconOnly
            aria-label={visible ? "Hide password" : "Show password"}
            onPress={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </TextField>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.9 10.9 0 0 1 12 20C5 20 1 12 1 12a20 20 0 0 1 5.17-5.94" />
      <path d="M1 1l22 22" />
      <path d="M9.53 9.53A3 3 0 0 0 14.47 14.47" />
      <path d="M14.12 5.88A10.8 10.8 0 0 1 23 12a21.7 21.7 0 0 1-2.09 3.19" />
    </svg>
  );
}
