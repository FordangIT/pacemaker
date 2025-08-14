// ✅ index.tsx 수정
import { useAuth } from "@/hooks/useAuth";
import { useSetupGate } from "@/hooks/useSetupGate";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react"; // 추가

export default function Index() {
  const { isAuthenticated, load } = useAuth(); // load 추가
  const { isSetupDone } = useSetupGate();
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  // 🆕 앱 시작 시 인증 상태 로딩
  useEffect(() => {
    const initialize = async () => {
      await load();
      setIsLoading(false);
    };
    initialize();
  }, [load]);

  // 로딩 중일 때는 아무것도 렌더링하지 않음
  if (isLoading) return null;

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (!isSetupDone) return <Redirect href="/(setup)/profile" />;
  return <Redirect href="/(tabs)/goals" />;
}
