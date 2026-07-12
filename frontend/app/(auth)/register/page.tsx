"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  ErrorMessage,
  Label,
  ListBox,
  Select,
} from "@heroui/react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { TextInput, PasswordInput } from "@/components/form-fields";
import { ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS, type Role } from "@/lib/types";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  role?: string;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<Role | null>(null);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (name.trim().length < 2) errors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errors.email = "Enter a valid email address.";
    if (password.length < 8)
      errors.password = "Password must be at least 8 characters.";
    if (confirm !== password) errors.confirm = "Passwords do not match.";
    if (!role) errors.role = "Select a role.";
    return errors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: role as Role,
      });
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.status === 409
            ? "An account with this email already exists."
            : err.message
          : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-2">
      <Card.Header className="gap-1">
        <Card.Title className="text-2xl">Create your account</Card.Title>
        <Card.Description>
          Get started with TransitOps in a few seconds.
        </Card.Description>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {error ? (
            <Alert status="danger">
              <Alert.Content>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Content>
            </Alert>
          ) : null}

          <TextInput
            label="Full name"
            name="name"
            value={name}
            onChange={setName}
            placeholder="Jane Doe"
            autoComplete="name"
            isRequired
            isDisabled={submitting}
            error={fieldErrors.name}
          />

          <TextInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={setEmail}
            placeholder="you@company.com"
            autoComplete="email"
            isRequired
            isDisabled={submitting}
            error={fieldErrors.email}
          />

          <Select
            className="w-full"
            placeholder="Select your role"
            isDisabled={submitting}
            isInvalid={Boolean(fieldErrors.role)}
            value={role ?? undefined}
            onChange={(value) => {
              setRole(value as Role);
              setFieldErrors((prev) => ({ ...prev, role: undefined }));
            }}
          >
            <Label>Role</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {ROLES.map((r) => (
                  <ListBox.Item
                    key={r}
                    id={r}
                    textValue={ROLE_LABELS[r]}
                    className="flex-col items-start gap-0.5"
                  >
                    <span className="font-medium">{ROLE_LABELS[r]}</span>
                    <span className="text-xs text-muted">
                      {ROLE_DESCRIPTIONS[r]}
                    </span>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
            {fieldErrors.role ? (
              <ErrorMessage>{fieldErrors.role}</ErrorMessage>
            ) : null}
          </Select>

          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            isDisabled={submitting}
            error={fieldErrors.password}
          />

          <PasswordInput
            label="Confirm password"
            name="confirmPassword"
            value={confirm}
            onChange={setConfirm}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            isDisabled={submitting}
            error={fieldErrors.confirm}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isPending={submitting}
            isDisabled={submitting}
          >
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </Card.Content>

      <Card.Footer className="justify-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="ml-1 font-medium text-link hover:underline"
        >
          Sign in
        </Link>
      </Card.Footer>
    </Card>
  );
}
