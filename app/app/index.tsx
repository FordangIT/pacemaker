import { useAuth } from "@/hooks/useAuth";
import { useSetupGate } from "@/hooks/useSetupGate";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated } = useAuth();
  const { isSetupDone } = useSetupGate();

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (!isSetupDone) return <Redirect href="/(setup)/profile" />;
  return <Redirect href="/(tabs)/goals" />;
}
