import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Login() {
  const { isAuthenticated, load, signInWithGoogle, signInWithKakao } =
    useAuth();

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (isAuthenticated) router.replace("/(setup)/profile");
  }, [isAuthenticated]);

  return (
    <View style={s.container}>
      <Text style={s.title}>로그인</Text>

      <TouchableOpacity style={[s.btn, s.kakao]} onPress={signInWithKakao}>
        <Text style={s.btnText}>카카오로 시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[s.btn, s.google]} onPress={signInWithGoogle}>
        <Text style={s.btnText}>Google로 시작하기</Text>
      </TouchableOpacity>

      {/* (디버그) 회원 없이도 보기 */}
      {/* <Link href="/(tabs)/goals">건너뛰기</Link> */}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 24 },
  btn: {
    width: 280,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  kakao: { backgroundColor: "#F7E317" },
  google: { backgroundColor: "#4285F4" }
});
