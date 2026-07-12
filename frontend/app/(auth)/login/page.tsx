"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, Card } from "@heroui/react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { TextInput, PasswordInput } from "@/components/form-fields";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <Card className="p-2">
      <Card.Header className="gap-1">
        <Card.Title className="text-2xl">Welcome back</Card.Title>
        <Card.Description>
          Sign in to your TransitOps account to continue.
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
      </Card.Content>

      <Card.Footer className="justify-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="ml-1 font-medium text-link hover:underline"
        >
          Create one
        </Link>
      </Card.Footer>
    </Card>
  );
}
