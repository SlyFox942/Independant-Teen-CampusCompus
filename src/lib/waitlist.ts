import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";

export interface WaitlistInput {
  name: string;
  email: string;
  school: string;
  role: string;
  message: string;
}

export interface WaitlistResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Server function that stores a waitlist submission in the Neon database.
 * Creates the table on first use (idempotent). Ready to use once DATABASE_URL
 * is set — throws a clear error if it isn't.
 */
export const submitToWaitlist = createServerFn({ method: "POST" })
  .validator((data: WaitlistInput) => {
    if (!data.name?.trim()) throw new Error("Name is required");
    if (!data.email?.trim()) throw new Error("Email is required");
    if (!data.school?.trim()) throw new Error("School name is required");
    if (!data.role?.trim()) throw new Error("Role is required");
    return {
      name: data.name.trim(),
      email: data.email.trim(),
      school: data.school.trim(),
      role: data.role.trim(),
      message: data.message?.trim() || "",
    };
  })
  .handler(async ({ data }) => {
    const db = sql();

    // Create the table if it doesn't exist (idempotent)
    await db`
      CREATE TABLE IF NOT EXISTS waitlist_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        school TEXT NOT NULL,
        role TEXT NOT NULL,
        message TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Insert the submission
    const result = await db`
      INSERT INTO waitlist_submissions (name, email, school, role, message)
      VALUES (${data.name}, ${data.email}, ${data.school}, ${data.role}, ${data.message})
      RETURNING id
    `;

    const row = result[0] as { id: string } | undefined;

    return {
      success: true,
      id: row?.id,
    } satisfies WaitlistResult;
  });