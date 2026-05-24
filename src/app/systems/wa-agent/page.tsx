import { WaAgentDashboard } from "./wa-agent-dashboard";

export const metadata = {
  title: "WA Agent Monitor — GrowthForge Mission Monitor",
  description: "Monitor WhatsApp AI agents, their customers, models, and conversation states.",
};

export default function WaAgentPage() {
  return <WaAgentDashboard />;
}
