// app/play/[pace].tsx
import { Audio } from "expo-av";
import { router, useGlobalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function PlayScreen() {
  const { pace } = useGlobalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const parsePaceToBpm = (pace: string) => {
    const match = pace.match(/^(\d)(\d)(\d)?$/); // e.g. 530 => "5:30"
    if (!match) return 180;
    const min = parseInt(match[1], 10);
    const sec = parseInt(match[2] + (match[3] || "0"), 10);
    const totalSec = min * 60 + sec;
    const bpm = (3600 / totalSec) * 2; // e.g. 180 bpm = 2 steps per second
    return bpm;
  };

  const playClick = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
    }
  };

  const startLoop = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/click.mp3") // 경로 조정 필요
    );
    soundRef.current = sound;

    const bpm = parsePaceToBpm(pace as string);
    const interval = 60000 / bpm;

    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      playClick();
    }, interval);
  };

  const stopLoop = async () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopLoop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.pace}>
        선택된 페이스: {pace?.slice(0, -2)}:{pace?.slice(-2)}
      </Text>
      <View style={styles.buttons}>
        <Button title="시작" onPress={startLoop} disabled={isPlaying} />
        <Button title="정지" onPress={stopLoop} disabled={!isPlaying} />
        <Button title="뒤로가기" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24
  },
  pace: { fontSize: 28, fontWeight: "bold" },
  buttons: { gap: 12 }
});
