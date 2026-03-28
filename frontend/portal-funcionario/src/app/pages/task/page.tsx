import { GetSessionCookie } from "@/app/api/session";
import TaskList from "@/app/feature/task/taskList";

export default async function TaskPage() {
  const session = await GetSessionCookie();
  const user: string = session?.sub ?? session?.username ?? session?.user ?? "";
  return <TaskList user={user} />;
}
