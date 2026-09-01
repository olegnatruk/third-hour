/**
 * Step 2: scan modules 1-3 of a course and print every module item.
 *
 *   node canvas/scan-modules.ts <courseId>
 */
import { canvasGet, canvasGetAll } from "./client.ts";

interface CompletionRequirement {
  type?: string;
  min_score?: number;
  completed?: boolean;
}

interface ContentDetails {
  points_possible?: number;
  due_at?: string | null;
  locked_for_user?: boolean;
}

interface ModuleItem {
  id: number;
  position?: number;
  title?: string;
  type?: string;
  indent?: number;
  html_url?: string;
  external_url?: string;
  page_url?: string;
  completion_requirement?: CompletionRequirement;
  content_details?: ContentDetails;
}

interface CourseModule {
  id: number;
  position?: number;
  name?: string;
  state?: string;
  unlock_at?: string | null;
  items_count?: number;
  items?: ModuleItem[];
}

interface Course {
  id: number;
  name?: string;
  course_code?: string;
}

function fmtRequirement(r?: CompletionRequirement): string {
  if (!r?.type) return "";
  const label = r.type.replace(/_/g, " ");
  const score = r.min_score !== undefined ? ` (min ${r.min_score})` : "";
  return `  [req: ${label}${score}]`;
}

function fmtDetails(d?: ContentDetails): string {
  if (!d) return "";
  const bits: string[] = [];
  if (d.points_possible !== undefined) bits.push(`${d.points_possible} pts`);
  if (d.due_at) bits.push(`due ${d.due_at}`);
  if (d.locked_for_user) bits.push("locked");
  return bits.length ? `  {${bits.join(", ")}}` : "";
}

function itemLink(it: ModuleItem): string {
  const link = it.external_url || it.html_url || (it.page_url ? `page:${it.page_url}` : "");
  return link ? `\n        ${link}` : "";
}

function printItem(it: ModuleItem): void {
  const indent = "  ".repeat(it.indent ?? 0);
  const pos = it.position !== undefined ? `${it.position}. ` : "";
  console.log(
    `    ${indent}${pos}${it.title ?? "(untitled)"}  <${it.type ?? "?"}>` +
      fmtRequirement(it.completion_requirement) +
      fmtDetails(it.content_details) +
      itemLink(it),
  );
}

async function main(): Promise<void> {
  const courseId = process.argv[2];
  if (!courseId || !/^\d+$/.test(courseId)) {
    console.error("Usage: node canvas/scan-modules.ts <courseId>");
    console.error("Run  node canvas/list-favorites.ts  to see course ids.");
    process.exit(1);
  }

  let courseLabel = `course ${courseId}`;
  try {
    const course = await canvasGet<Course>(`/courses/${courseId}`);
    courseLabel = `${course.name ?? "(unnamed)"} (id=${course.id}, ${course.course_code ?? "-"})`;
  } catch {
    /* best-effort header only */
  }

  const modules = await canvasGetAll<CourseModule>(`/courses/${courseId}/modules`, {
    "include[]": ["items", "content_details"],
  });

  modules.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const target = modules.slice(0, 3);

  console.log(`\n${courseLabel}`);
  console.log(`Modules: ${modules.length} total, scanning first ${target.length}\n`);

  if (modules.length < 3) {
    console.log(`Note: course has only ${modules.length} module(s).\n`);
  }

  for (const mod of target) {
    const pos = mod.position ?? "?";
    const unlock = mod.unlock_at ? `, unlock_at=${mod.unlock_at}` : "";
    let items = mod.items ?? [];

    // Canvas omits the inline items array when a module has many items.
    if (items.length === 0 && (mod.items_count ?? 0) > 0) {
      items = await canvasGetAll<ModuleItem>(`/courses/${courseId}/modules/${mod.id}/items`, {
        "include[]": ["content_details"],
      });
    }

    console.log(
      `Module ${pos}: ${mod.name ?? "(unnamed)"}  [state=${mod.state ?? "-"}${unlock}]  ` +
        `${items.length} item(s)`,
    );
    if (items.length === 0) {
      console.log("    (no items)");
    } else {
      items
        .slice()
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .forEach(printItem);
    }
    console.log("");
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
