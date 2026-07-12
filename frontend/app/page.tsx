import { redirect } from "next/navigation";

// The landing route sends users into the app. `proxy.ts` handles the
// authenticated-vs-anonymous decision (dashboard for signed-in users, /login
// otherwise), so we just forward to the dashboard here.
export default function Home() {
  redirect("/dashboard");
}
