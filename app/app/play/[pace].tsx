// app/play/index.tsx
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function PlayScreen() {
  const { pace, sound, mode, strideLength } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const parsePaceToBpm = (pace: string) => {
    if (!pace || typeof pace !== "string") return 180;
    const match = pace.match(/^(\d)(\d)(\d)?$/); // e.g. "530" -> 5:30
    if (!match) return 180;
    const min = parseInt(match[1], 10);
    const sec = parseInt(match[2] + (match[3] || "0"), 10);
    const totalSec = min * 60 + sec;
    return (3600 / totalSec) * 2; // 2 steps per second equivalent bpm
  };

  const playClick = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
    }
  };

  const startLoop = async () => {
    const { sound: newSound } = await Audio.Sound.createAsync(
      getSoundFile(sound)
    );
    soundRef.current = newSound;

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

  const getSoundFile = (name: string | string[] | undefined) => {
    if (Array.isArray(name)) name = name[0];
    switch (name) {
      case "beep":
        return require("../../assets/sounds/beep.mp3");
      case "clave":
        return require("../../assets/sounds/clave.mp3");
      case "footstep":
        return require("../../assets/sounds/footstep.mp3");
      case "snare":
        return require("../../assets/sounds/snare.mp3");
      default:
        return require("../../assets/sounds/metronome.mp3");
    }
  };

  useEffect(() => {
    return () => {
      stopLoop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Pace: {pace?.slice(0, -2)}:{pace?.slice(-2)}
      </Text>
      <Text style={styles.label}>Sound: {sound}</Text>
      <Text style={styles.label}>Mode: {mode}</Text>
      <Text style={styles.label}>Stride Length: {strideLength} cm</Text>
      <View style={styles.buttons}>
        <Button title="Start" onPress={startLoop} disabled={isPlaying} />
        <Button title="Stop" onPress={stopLoop} disabled={!isPlaying} />
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16
  },
  label: {
    fontSize: 20,
    fontWeight: "600"
  },
  buttons: {
    gap: 12,
    marginTop: 24
  }
});
