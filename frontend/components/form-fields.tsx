"use client";

import { useState } from "react";
import { ErrorMessage, Input, Label, TextField } from "@heroui/react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
  placeholder?: string;
  autoComplete?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  error?: string;
  name?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  isRequired,
  isDisabled,
  error,
  name,
}: TextInputProps) {
  return (
    <TextField
      className="w-full"
      type={type}
      value={value}
      onChange={onChange}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={Boolean(error)}
      name={name}
      autoComplete={autoComplete}
    >
      <Label>{label}</Label>
      <Input placeholder={placeholder} />
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </TextField>
  );
}

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  isDisabled?: boolean;
  error?: string;
  name?: string;
}

export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
  isDisabled,
  error,
  name = "password",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      className="w-full"
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      isRequired
      isDisabled={isDisabled}
      isInvalid={Boolean(error)}
      name={name}
      autoComplete={autoComplete}
    >
      <Label>{label}</Label>
      <div className="relative">
        <Input placeholder={placeholder} className="pr-10" />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={isDisabled}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted transition-colors hover:text-foreground disabled:opacity-50"
        >
          {visible ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </TextField>
  );
}
