import { createAdminClient } from "@backend/auth/admin-client";
import {
  AccountSuspendedError,
  AuthenticationError,
  AuthorizationError,
  requireRole,
} from "@backend/auth/current-user";
import {
  parseRewardDefinition,
  RewardDefinitionValidationError,
} from "@backend/rewards/definitions";
import { createClient } from "@/lib/supabase/server";

function errorResponse(error: unknown) {
  if (error instanceof AuthenticationError) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (error instanceof AccountSuspendedError || error instanceof AuthorizationError) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (error instanceof RewardDefinitionValidationError) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ error: "Unable to manage reward definition." }, { status: 500 });
}

export async function GET() {
  try {
    await requireRole(["admin", "owner"]);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reward_definitions")
      .select("id, name, description, is_active, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return Response.json({ rewards: data });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireRole(["owner"]);
    const reward = parseRewardDefinition(await request.json());
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.rpc("set_active_reward_definition", {
      p_actor_id: actor.user.id,
      p_name: reward.name,
      p_description: reward.description,
    });

    if (error) {
      throw error;
    }

    return Response.json({ reward: data });
  } catch (error) {
    return errorResponse(error);
  }
}
