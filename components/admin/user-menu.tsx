import { auth } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export async function AdminUserMenu() {
  const session = await auth();
  const name = session?.user?.name ?? "Staff";
  const role = session?.user?.role ?? "";

  return (
    <div className="flex items-center gap-3">
      <div className="text-right text-sm leading-tight">
        <p className="font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
      <form action={logoutAction}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
