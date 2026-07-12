"use client";

// SHARED PRIMITIVE — OWNER: Mayuri
// Page title + optional description + right-aligned actions (e.g. "Add Vehicle").
// TODO: layout + responsive action slot.

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
