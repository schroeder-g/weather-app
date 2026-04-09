import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import colors from "tailwindcss/colors";
import { loginUser } from "@/features/identity/identitySlice";
import type { AppDispatch, RootState } from "@/store/store";

export interface LoginState {
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
	isAttempting: boolean;
}

export interface LoginActions {
	submit: () => void;
}

export interface LoginContextValue {
	state: LoginState;
	actions: LoginActions;
}

const LoginContext = createContext<LoginContextValue | null>(null);

function useLogin() {
	const context = useContext(LoginContext);
	if (!context) {
		throw new Error("useLogin must be used within a LoginProvider");
	}
	return context;
}

export function LoginProvider({ children }: { children: React.ReactNode }) {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const { status, error } = useSelector((state: RootState) => state.identity);
	const [isAttempting, setIsAttempting] = useState(false);

	const handleLogin = async () => {
		setIsAttempting(true);
		const resultAction = await dispatch(
			loginUser({ email: "demo@whether.io", password: "good-password" }),
		);
		if (loginUser.fulfilled.match(resultAction)) {
			router.replace("/");
		}
		setIsAttempting(false);
	};

	const value = useMemo(
		() => ({
			state: { status, error, isAttempting },
			actions: { submit: handleLogin },
		}),
		[status, error, isAttempting],
	);

	return (
		<LoginContext.Provider value={value}>{children}</LoginContext.Provider>
	);
}

export function LoginFrame({ children }: { children: React.ReactNode }) {
	return (
		<View className="flex-1 bg-slate-50 justify-center items-center">
			<View className="w-full max-w-md px-4 sm:px-6">
				<View
					className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-10 border border-slate-200 overflow-hidden"
					style={{
						shadowColor: "#94a3b8",
						shadowOffset: { width: 0, height: 10 },
						shadowOpacity: 0.1,
						shadowRadius: 20,
						elevation: 5,
					}}
				>
					{children}
				</View>
			</View>
		</View>
	);
}

export function LoginHeader() {
	return (
		<Animated.View entering={FadeInUp.duration(400)} className="items-center">
			<Text className="text-red-500 font-bold text-[34px] sm:text-[40px] tracking-tight mb-1 text-center">
				Whether.io
			</Text>
			<Text className="text-slate-500 text-center text-sm sm:text-[15px] tracking-wide leading-relaxed px-2">
				Know what's coming. Plan accordingly.
			</Text>
		</Animated.View>
	);
}

export function LoginButton() {
	const {
		state: { status, isAttempting },
		actions: { submit },
	} = useLogin();

	return (
		<TouchableOpacity
			testID="login-button"
			onPress={submit}
			disabled={status === "loading"}
			activeOpacity={0.8}
		>
			<LinearGradient
				colors={[colors.red[500], colors.red[400]]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={{
					height: 56,
					alignItems: "center",
					justifyContent: "center",
					borderRadius: 16,
				}}
			>
				{status === "loading" && isAttempting ? (
					<ActivityIndicator color="#fff" />
				) : (
					<Text className="text-white font-semibold text-base sm:text-[17px] tracking-wide text-center">
						Continue
					</Text>
				)}
			</LinearGradient>
		</TouchableOpacity>
	);
}

export function LoginError() {
	const {
		state: { error },
	} = useLogin();

	if (!error) return null;

	return (
		<Animated.View entering={FadeInDown.duration(300)}>
			<Text className="text-destructive text-center mt-5 font-medium">
				{error}
			</Text>
		</Animated.View>
	);
}

const Login = {
	Provider: LoginProvider,
	Frame: LoginFrame,
	Header: LoginHeader,
	Button: LoginButton,
	Error: LoginError,
};

export default function LoginScreen() {
	return (
		<Login.Provider>
			<Login.Frame>
				<Login.Header />
				<View className="h-8 sm:h-12" />
				<Animated.View entering={FadeInUp.delay(100).duration(400)}>
					<Login.Button />
					<Login.Error />
				</Animated.View>
			</Login.Frame>
		</Login.Provider>
	);
}
