/**
 * Step 1: list all favourite courses for the authenticated user, so you can
 * pick which course to analyze next.
 *
 *   node canvas/list-favorites.ts
 */
import { canvasGetAll } from "./client.ts";

interface Enrollment {
  type?: string;
  role?: string;
  enrollment_state?: string;
}

interface Course {
  id: number;
  name?: string;
  course_code?: string;
  workflow_state?: string;
  term?: { name?: string };
  enrollments?: Enrollment[];
}

function role(course: Course): string {
  const e = course.enrollments?.[0];
  if (!e) return "-";
  return (e.role || e.type || "-").replace(/Enrollment$/, "");
}

async function main(): Promise<void> {
  const courses = await canvasGetAll<Course>("/users/self/favorites/courses", {
    "include[]": ["term"],
  });

  if (courses.length === 0) {
    console.log(
      "No favourite courses found.\n" +
        "Star some courses in the Canvas dashboard, or list all courses with GET /api/v1/courses.",
    );
    return;
  }

  console.log(`\nFavourite courses (${courses.length}):\n`);
  courses.forEach((c, i) => {
    const num = String(i + 1).padStart(2, " ");
    console.log(`${num}. ${c.name ?? "(unnamed)"}`);
    console.log(
      `    id=${c.id}  code=${c.course_code ?? "-"}  term=${c.term?.name ?? "-"}` +
        `  role=${role(c)}  state=${c.workflow_state ?? "-"}`,
    );
  });

  console.log(`\nTo scan a course:  node canvas/scan-modules.ts <courseId>\n`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
