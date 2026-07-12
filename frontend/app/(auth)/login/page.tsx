"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Label,
  ListBox,
  Select,
} from "@heroui/react";

import { TextInput, PasswordInput } from "@/components/form-fields";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { ROLE_LABELS, ROLES, type Role } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("FLEET_MANAGER");
  const [remember, setRemember] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      await login({
        email: email.trim(),
        password,
      });

      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.status === 401
            ? "Invalid email or password."
            : err.message
          : "Unable to sign in.",
      );

      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md border border-border/80 bg-surface/95 p-8 shadow-sm shadow-black/5">
      <div className="mb-8 border-b border-border pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Authentication
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-foreground">Sign In</h1>

        <p className="mt-2 text-sm text-muted">
          Login to continue to TransitOps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error ? <Alert status="danger">{error}</Alert> : null}

        <TextInput
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          autoComplete="email"
          required
          disabled={submitting}
        />

        <PasswordInput
          label="Password"
          name="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          disabled={submitting}
        />

        <Select
          className="flex w-full flex-col gap-1.5"
          placeholder="Select your role"
          selectedKey={role}
          onSelectionChange={(key) => setRole(key as Role)}
          isDisabled={submitting}
        >
          <Label>Role</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {ROLES.map((item) => (
                <ListBox.Item key={item} id={item}>
                  {ROLE_LABELS[item]}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <div className="flex items-center justify-between">
          <Checkbox
            isSelected={remember}
            onChange={setRemember}
            isDisabled={submitting}
          >
            Remember me
          </Checkbox>

          <Link
            href="/forgot-password"
            className="text-sm text-accent hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isDisabled={submitting}
        >
          {submitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 border-t border-border pt-4">
        <p className="text-xs text-muted">
          TransitOps • Role Based Access Control
        </p>
      </div>
    </Card>
  );
}
