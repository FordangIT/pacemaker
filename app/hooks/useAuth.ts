// hooks/useAuth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { useCallback, useMemo, useState } from "react";
import { Platform } from "react-native";

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!;
const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY!;

type AuthUser = {
  provider: "google" | "kakao";
  accessToken: string;
  refreshToken?: string;
  idToken?: string; // google
  profile?: any;
};

const TOKEN_KEY = "auth_token";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  // 플랫폼별 저장소 함수들
  const setItem = useCallback(async (key: string, value: string) => {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }, []);

  const getItem = useCallback(async (key: string) => {
    if (Platform.OS === "web") {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }, []);

  const deleteItem = useCallback(async (key: string) => {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }, []);

  const load = useCallback(async () => {
    try {
      const raw = await getItem(TOKEN_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, [getItem]);

  const save = useCallback(
    async (data: AuthUser) => {
      try {
        await setItem(TOKEN_KEY, JSON.stringify(data));
        setUser(data);
      } catch (error) {
        console.error("Failed to save user:", error);
      }
    },
    [setItem]
  );

  const signOut = useCallback(async () => {
    try {
      await deleteItem(TOKEN_KEY);
      setUser(null);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  }, [deleteItem]);

  // ---------------- Google (Auth Code + PKCE) ----------------
  const signInWithGoogle = useCallback(async () => {
    try {
      const discovery = {
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenEndpoint: "https://oauth2.googleapis.com/token",
        revocationEndpoint: "https://oauth2.googleapis.com/revoke"
      };

      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_WEB_CLIENT_ID,
        redirectUri,
        scopes: ["openid", "profile", "email"],
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true
      });

      await request.makeAuthUrlAsync(discovery);

      const result = await request.promptAsync(discovery, { useProxy: true });
      if (result.type !== "success" || !result.params.code) return;

      const body = {
        code: result.params.code,
        client_id: GOOGLE_WEB_CLIENT_ID,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: request.codeVerifier!
      };

      const res = await fetch(discovery.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(body as any).toString()
      });

      const token = await res.json();
      if (!res.ok) {
        throw new Error(
          token.error_description || "Google token exchange failed"
        );
      }

      // 🆕 사용자 프로필 정보 가져오기 추가
      const profileRes = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`
          }
        }
      );
      const profile = await profileRes.json();

      const data: AuthUser = {
        provider: "google",
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        idToken: token.id_token,
        profile
      };
      await save(data);
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  }, [redirectUri, save]);

  // ---------------- Kakao (Auth Code -> Token) ----------------
  // ---------------- Kakao (새로운 방식) ----------------
  const signInWithKakao = useCallback(async () => {
    try {
      const discovery = {
        authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
        tokenEndpoint: "https://kauth.kakao.com/oauth/token",
        revocationEndpoint: "https://kauth.kakao.com/oauth/logout"
      };

      // AuthRequest 사용하는 새로운 방식
      const request = new AuthSession.AuthRequest({
        clientId: KAKAO_REST_API_KEY,
        redirectUri,
        scopes: [], // 카카오는 scopes를 사용하지 않음
        responseType: AuthSession.ResponseType.Code
      });

      await request.makeAuthUrlAsync(discovery);

      // startAsync 대신 promptAsync 사용
      const result = await request.promptAsync(discovery, { useProxy: true });

      if (result.type !== "success" || !result.params.code) {
        console.log("Kakao login cancelled or failed");
        return;
      }

      const code = result.params.code;

      // 토큰 교환
      const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: KAKAO_REST_API_KEY,
          redirect_uri: redirectUri,
          code
        }).toString()
      });

      const token = await tokenRes.json();
      if (!tokenRes.ok) {
        throw new Error(
          token.error_description || "Kakao token exchange failed"
        );
      }

      // 🆕 사용자 프로필 정보 가져오기 추가
      const profileRes = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${token.access_token}`
        }
      });
      const profile = await profileRes.json();

      const data: AuthUser = {
        provider: "kakao",
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        profile
      };
      await save(data);
    } catch (error) {
      console.error("Kakao sign in error:", error);
      throw error;
    }
  }, [redirectUri, save]);

  const isAuthenticated = useMemo(() => !!user, [user]);

  return {
    user,
    isAuthenticated,
    load,
    signOut,
    signInWithGoogle,
    signInWithKakao
  };
}
