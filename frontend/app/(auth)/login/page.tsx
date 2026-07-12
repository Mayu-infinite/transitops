"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Label, ListBox, Select } from "@heroui/react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { TextInput, PasswordInput } from "@/components/form-fields";
import { ROLE_LABELS, ROLES, type Role } from "@/lib/types";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("FLEET_MANAGER");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.status === 401
            ? "Invalid email or password."
            : err.message
          : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <Card className="border border-border/80 bg-surface/95 p-7 shadow-xl shadow-black/10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase text-accent">
          Authentication · RBAC
        </p>
        <h1 className="mt-2 text-2xl font-semibold">
          Sign in to your account
        </h1>
        <p className="mt-2 text-sm text-muted">
          Use your TransitOps credentials to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error ? (
          <Alert status="danger">
            <Alert.Content>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
          </Alert>
        ) : null}

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
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          autoComplete="current-password"
          isDisabled={submitting}
        />

        <Select
          className="w-full"
          selectedKey={role}
          isDisabled={submitting}
          onSelectionChange={(key) => {
            if (typeof key === "string") setRole(key as Role);
          }}
        >
          <Label>Role</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {ROLES.map((item) => (
                <ListBox.Item key={item} id={item} textValue={ROLE_LABELS[item]}>
                  {ROLE_LABELS[item]}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={submitting}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            Remember me
          </label>
          <Link
            href="/login"
            className="text-sm font-medium text-link hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isPending={submitting}
          isDisabled={submitting}
        >
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 rounded-lg bg-accent-soft px-3 py-2 text-xs text-accent-soft-foreground">
        Access after sign-in follows the saved user role from the backend. The
        role shown here mirrors the RBAC mockup for operational context.
      </p>
    </Card>
  );
}
