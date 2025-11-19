// // /src/app/login/LoginClient.tsx

// "use client";

// import { useState, Suspense } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { Loader2 } from "lucide-react";
// import { FaGoogle, FaFacebook } from "react-icons/fa";

// // METADATA EXPORT HAS BEEN REMOVED FROM THIS FILE

// const SocialLogins = () => {
//   // ... (No changes in this component)
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [isFacebookLoading, setIsFacebookLoading] = useState(false);

//   const handleSocialLogin = async (provider: "google" | "facebook") => {
//     if (provider === "google") setIsGoogleLoading(true);
//     if (provider === "facebook") setIsFacebookLoading(true);
//     await signIn(provider, { callbackUrl: "/account" });
//   };

//   return (
//     <>
//       <div className="relative my-6">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-200 dark:border-gray-700" />
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
//             Or continue with
//           </span>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <button
//           type="button"
//           onClick={() => handleSocialLogin("google")}
//           disabled={isGoogleLoading || isFacebookLoading}
//           className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
//         >
//           <FaGoogle className="text-[#DB4437]" />
//           <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
//             Google
//           </span>
//         </button>
//         <button
//           type="button"
//           onClick={() => handleSocialLogin("facebook")}
//           disabled={isGoogleLoading || isFacebookLoading}
//           className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
//         >
//           <FaFacebook className="text-[#1877F2]" />
//           <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
//             Facebook
//           </span>
//         </button>
//       </div>
//     </>
//   );
// };

// const LoginForm = () => {
//   // ... (No changes in this component's logic)
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/account";

//   const [email, setEmail] = useState(searchParams.get("email") || "");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [failedAttempts, setFailedAttempts] = useState(0);
//   const MAX_ATTEMPTS = 5;

//   const inputStyles =
//     "appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm";

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const result = await signIn("credentials", {
//         redirect: false,
//         email,
//         password,
//       });

//       if (result?.error) {
//         setFailedAttempts((prev) => prev + 1);
//         if (result.error === "CredentialsSignin") {
//           toast.error("Invalid email or password.");
//         } else if (result.error === "EmailNotVerified") {
//           toast.error("Your email is not verified.");
//           router.push(`/verify-email?email=${encodeURIComponent(email)}`);
//         } else {
//           toast.error(result.error);
//         }
//         setIsLoading(false);
//       } else if (result?.ok) {
//         toast.success("Logged in successfully!");
//         router.push(callbackUrl);
//       }
//     } catch (error: any) {
//       setFailedAttempts(MAX_ATTEMPTS);
//       toast.error(
//         "Too many login attempts. Please try again in a few moments."
//       );
//       setIsLoading(false);
//     }
//   };

//   const isLocked = failedAttempts >= MAX_ATTEMPTS;

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {isLocked && (
//         <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-center">
//           <p className="text-sm font-medium text-red-700 dark:text-red-300">
//             You have reached the maximum number of login attempts. <br /> Please
//             wait a moment before trying again.
//           </p>
//         </div>
//       )}

//       <fieldset disabled={isLocked || isLoading} className="space-y-6">
//         <div>
//           <label
//             htmlFor="email-login"
//             className="block text-sm font-medium mb-1"
//           >
//             Email Address
//           </label>
//           <input
//             id="email-login"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             autoComplete="email"
//             className={`${inputStyles} disabled:opacity-50`}
//           />
//         </div>
//         <div>
//           <div className="flex justify-between items-center">
//             <label
//               htmlFor="password-login"
//               className="block text-sm font-medium mb-1"
//             >
//               Password
//             </label>
//             <Link
//               href="/forgot-password"
//               className={`text-sm font-medium text-brand-primary hover:underline ${isLocked ? "pointer-events-none" : ""}`}
//             >
//               Forgot Password?
//             </Link>
//           </div>
//           <input
//             id="password-login"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             autoComplete="current-password"
//             className={`${inputStyles} disabled:opacity-50`}
//           />
//         </div>
//       </fieldset>

//       <button
//         type="submit"
//         disabled={isLoading || isLocked}
//         className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-brand-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed"
//       >
//         {isLoading && <Loader2 className="animate-spin" size={20} />}
//         {isLoading ? "Logging in..." : "Login"}
//       </button>
//     </form>
//   );
// };

// export default function LoginClient() {
//   // Renamed from LoginPage to LoginClient
//   return (
//     <main className="w-full bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen py-12 px-4">
//       <div className="w-full max-w-md p-8 sm:p-10 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
//         <div className="text-center">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
//             Login to Your Account
//           </h1>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//             Welcome back! Please enter your details.
//           </p>
//         </div>

//         <Suspense
//           fallback={
//             <div className="flex justify-center pt-10">
//               <Loader2 className="animate-spin text-brand-primary" />
//             </div>
//           }
//         >
//           <LoginForm />
//         </Suspense>

//         <SocialLogins />

//         <p className="text-center text-sm text-gray-500 dark:text-gray-400">
//           Don't have an account?{" "}
//           <Link
//             href="/register"
//             className="font-semibold text-brand-primary hover:underline"
//           >
//             Register here
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// }
// "use client";

// import { useState, Suspense, useEffect } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { Loader2 } from "lucide-react";
// import { FaGoogle, FaFacebook } from "react-icons/fa";

// // Social Logins component - No changes needed here.
// const SocialLogins = () => {
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [isFacebookLoading, setIsFacebookLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/account";

//   const handleSocialLogin = async (provider: "google" | "facebook") => {
//     setIsGoogleLoading(provider === 'google');
//     setIsFacebookLoading(provider === 'facebook');
//     // Let NextAuth handle the entire redirect flow.
//     await signIn(provider, { callbackUrl });
//   };

//   return (
//     <>
//       <div className="relative my-6">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-200 dark:border-gray-700" />
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
//             Or continue with
//           </span>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <button
//           type="button"
//           onClick={() => handleSocialLogin("google")}
//           disabled={isGoogleLoading || isFacebookLoading}
//           className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
//         >
//           <FaGoogle className="text-[#DB4437]" />
//           <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
//             Google
//           </span>
//         </button>
//         <button
//           type="button"
//           onClick={() => handleSocialLogin("facebook")}
//           disabled={isGoogleLoading || isFacebookLoading}
//           className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
//         >
//           <FaFacebook className="text-[#1877F2]" />
//           <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
//             Facebook
//           </span>
//         </button>
//       </div>
//     </>
//   );
// };
// // Credentials Login Form component
// const LoginForm = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/account";
//   const errorParam = searchParams.get("error");

//   const [email, setEmail] = useState(searchParams.get("email") || "");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // This useEffect will now handle errors coming from server-side redirects
//   useEffect(() => {
//     if (errorParam) {
//       if (errorParam === "CredentialsSignin") {
//         toast.error("Invalid email or password.");
//       } else if (errorParam === "EmailNotVerified") {
//         toast.error("Your email is not verified. Please check your inbox.");
//         // We don't need to redirect here as the user is already on the login page
//       } else {
//         toast.error("An authentication error occurred.");
//       }
//       // Clean the URL
//       router.replace('/login', { scroll: false });
//     }
//   }, [errorParam, router]);

//   const inputStyles = "appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm";

//   // --- THE FINAL, SIMPLIFIED SUBMIT HANDLER ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // We remove `redirect: false`.
//     // NextAuth will now handle the entire process.
//     // On success, it will redirect to `callbackUrl`.
//     // On failure, it will redirect back to this login page with an `error` query parameter.
//     await signIn("credentials", {
//       email,
//       password,
//       callbackUrl,
//     });

//     // In most cases, the code below will not be reached because of the redirect.
//     // But it's good practice to stop the loading state in case of an unexpected failure.
//     setIsLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <fieldset disabled={isLoading} className="space-y-6">
//         <div>
//           <label htmlFor="email-login" className="block text-sm font-medium mb-1">Email Address</label>
//           <input id="email-login" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={inputStyles}/>
//         </div>
//         <div>
//           <div className="flex justify-between items-center">
//             <label htmlFor="password-login" className="block text-sm font-medium mb-1">Password</label>
//             <Link href="/forgot-password" className="text-sm font-medium text-brand-primary hover:underline">Forgot Password?</Link>
//           </div>
//           <input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className={inputStyles}/>
//         </div>
//       </fieldset>
//       <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-brand-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed">
//         {isLoading && <Loader2 className="animate-spin" size={20} />}
//         {isLoading ? "Logging in..." : "Login"}
//       </button>
//     </form>
//   );
// };

// // Main parent component for the login page
// export default function LoginClient() {
//   return (
//     <main className="w-full bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen py-12 px-4">
//       <div className="w-full max-w-md p-8 sm:p-10 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
//         <div className="text-center">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Login to Your Account</h1>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Welcome back! Please enter your details.</p>
//         </div>
//         <Suspense fallback={ <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-brand-primary" /></div> }>
//           <LoginForm />
//         </Suspense>
//         <SocialLogins />
//         <p className="text-center text-sm text-gray-500 dark:text-gray-400">
//           Don't have an account?{" "}
//           <Link href="/register" className="font-semibold text-brand-primary hover:underline">Register here</Link>
//         </p>
//       </div>
//     </main>
//   );
// }

// // --- SUMMARY OF CHANGES ---
// // - **Removed `redirect: false`:** This is the most critical change. We now let NextAuth handle the redirection process, which is the most reliable method. It sends the `Set-Cookie` and `Location` headers in the same response, eliminating the race condition.
// // - **Simplified `handleSubmit`:** The function is now much simpler. It just calls `signIn` and lets it do all the work. The complex `if (result.error)` logic is no longer needed.
// // - **Improved `useEffect` for Errors:** The `useEffect` hook is now responsible for showing toast notifications based on the `error` parameter in the URL, which NextAuth will now add automatically on failure.

// // /src/app/login/LoginClient.tsx (THE FINAL, ROBUST & SIMPLEST VERSION)

// "use client";

// import { useState, Suspense, useEffect } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { Loader2 } from "lucide-react";
// import { FaGoogle, FaFacebook } from "react-icons/fa";

// // Social Logins component - No changes needed here.
// const SocialLogins = () => {
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [isFacebookLoading, setIsFacebookLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/account";

//   const handleSocialLogin = async (provider: "google" | "facebook") => {
//     setIsGoogleLoading(provider === "google");
//     setIsFacebookLoading(provider === "facebook");
//     // Let NextAuth handle the entire redirect flow.
//     await signIn(provider, { callbackUrl });
//   };

//   return (
//     <>
//       <div className="relative my-6">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-200 dark:border-gray-700" />
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
//             Or continue with
//           </span>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <button
//           type="button"
//           onClick={() => handleSocialLogin("google")}
//           disabled={isGoogleLoading || isFacebookLoading}
//           className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
//         >
//           <FaGoogle className="text-[#DB4437]" />
//           <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
//             Google
//           </span>
//         </button>
//         <button
//           type="button"
//           onClick={() => handleSocialLogin("facebook")}
//           disabled={isGoogleLoading || isFacebookLoading}
//           className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
//         >
//           <FaFacebook className="text-[#1877F2]" />
//           <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
//             Facebook
//           </span>
//         </button>
//       </div>
//     </>
//   );
// };

// // Credentials Login Form component
// const LoginForm = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/account";
//   const errorParam = searchParams.get("error");

//   const [email, setEmail] = useState(searchParams.get("email") || "");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // This useEffect will handle errors coming from server-side redirects
//   useEffect(() => {
//     if (errorParam) {
//       if (errorParam === "CredentialsSignin") {
//         toast.error("Invalid email or password.");
//       } else if (errorParam === "EmailNotVerified") {
//         toast.error("Your email is not verified. Please check your inbox.");
//       } else {
//         toast.error("An authentication error occurred.");
//       }
//       // Clean the URL by removing the error parameter
//       router.replace("/login", { scroll: false });
//     }
//   }, [errorParam, router]);

//   const inputStyles =
//     "appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm";

//   // --- THE FINAL, SIMPLIFIED SUBMIT HANDLER ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // We remove `redirect: false`.
//     // NextAuth will now handle the entire process.
//     // On success, it will redirect to `callbackUrl`.
//     // On failure, it will redirect back to this login page with an `error` query parameter.
//     await signIn("credentials", {
//       email,
//       password,
//       callbackUrl,
//     });

//     // This part of the code will likely not be reached due to the redirect,
//     // but it's a good fallback to stop the loading state if something unexpected happens.
//     setIsLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <fieldset disabled={isLoading} className="space-y-6">
//         <div>
//           <label
//             htmlFor="email-login"
//             className="block text-sm font-medium mb-1"
//           >
//             Email Address
//           </label>
//           <input
//             id="email-login"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             autoComplete="email"
//             className={inputStyles}
//           />
//         </div>
//         <div>
//           <div className="flex justify-between items-center">
//             <label
//               htmlFor="password-login"
//               className="block text-sm font-medium mb-1"
//             >
//               Password
//             </label>
//             <Link
//               href="/forgot-password"
//               className="text-sm font-medium text-brand-primary hover:underline"
//             >
//               Forgot Password?
//             </Link>
//           </div>
//           <input
//             id="password-login"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             autoComplete="current-password"
//             className={inputStyles}
//           />
//         </div>
//       </fieldset>
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-brand-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed"
//       >
//         {isLoading && <Loader2 className="animate-spin" size={20} />}
//         {isLoading ? "Logging in..." : "Login"}
//       </button>
//     </form>
//   );
// };

// // Main parent component for the login page
// export default function LoginClient() {
//   return (
//     <main className="w-full bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen py-12 px-4">
//       <div className="w-full max-w-md p-8 sm:p-10 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
//         <div className="text-center">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
//             Login to Your Account
//           </h1>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//             Welcome back! Please enter your details.
//           </p>
//         </div>
//         <Suspense
//           fallback={
//             <div className="flex justify-center pt-10">
//               <Loader2 className="animate-spin text-brand-primary" />
//             </div>
//           }
//         >
//           <LoginForm />
//         </Suspense>
//         <SocialLogins />
//         <p className="text-center text-sm text-gray-500 dark:text-gray-400">
//           Don't have an account?{" "}
//           <Link
//             href="/register"
//             className="font-semibold text-brand-primary hover:underline"
//           >
//             Register here
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// }

// // --- SUMMARY OF CHANGES ---
// // - **Removed `redirect: false`:** This is the most critical change. We now let NextAuth handle the entire redirection process. This is the most reliable method as it sends the `Set-Cookie` and `Location` headers in the same response, completely eliminating any "race condition" bugs.
// // - **Simplified `handleSubmit`:** The function is now much cleaner and simpler. It just calls `signIn` and lets NextAuth do all the work.
// // - **Improved `useEffect` for Errors:** The `useEffect` hook is now responsible for showing toast notifications based on the `error` parameter that NextAuth will automatically add to the URL on a failed login. This is more robust than handling the error on the client side.
// /src/app/login/LoginClient.tsx (THE FINAL, DEFINITIVE & SIMPLEST VERSION)

// "use client";

// import { useState, Suspense, useEffect } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { Loader2 } from "lucide-react";
// import { FaGoogle, FaFacebook } from "react-icons/fa";

// // Social Logins component - This uses the standard server-side redirect.
// const SocialLogins = () => {
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [isFacebookLoading, setIsFacebookLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/account";

//   const handleSocialLogin = async (provider: "google" | "facebook") => {
//     setIsGoogleLoading(provider === 'google');
//     setIsFacebookLoading(provider === 'facebook');
//     // Let NextAuth handle the entire redirect flow.
//     await signIn(provider, { callbackUrl });
//   };

//   return (
//     <>
//       <div className="relative my-6">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-200 dark:border-gray-700" />
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
//             Or continue with
//           </span>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <button type="button" onClick={() => handleSocialLogin("google")} disabled={isGoogleLoading || isFacebookLoading} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors">
//           <FaGoogle className="text-[#DB4437]" />
//           <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Google</span>
//         </button>
//         <button type="button" onClick={() => handleSocialLogin("facebook")} disabled={isGoogleLoading || isFacebookLoading} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors">
//           <FaFacebook className="text-[#1877F2]" />
//           <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Facebook</span>
//         </button>
//       </div>
//     </>
//   );
// };

// // Credentials Login Form component
// const LoginForm = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/account";
//   const errorParam = searchParams.get("error");

//   const [email, setEmail] = useState(searchParams.get("email") || "");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // This useEffect will handle errors coming from server-side redirects
//   useEffect(() => {
//     if (errorParam) {
//       if (errorParam === "CredentialsSignin") {
//         toast.error("Invalid email or password.");
//       } else if (errorParam === "EmailNotVerified") {
//         toast.error("Your email is not verified. Please check your inbox.");
//       } else {
//         toast.error("An authentication error occurred.");
//       }
//       // Clean the URL by removing the error parameter
//       router.replace('/login', { scroll: false });
//     }
//   }, [errorParam, router]);

//   const inputStyles = "appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm";

//   // --- THE FINAL, SIMPLIFIED SUBMIT HANDLER ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // We remove `redirect: false`.
//     // NextAuth will now handle the entire process.
//     // On success, it will redirect to `callbackUrl`.
//     // On failure, it will redirect back to this login page with an `error` query parameter.
//     // This is the most reliable method for both localhost and Vercel.
//     await signIn("credentials", {
//       email,
//       password,
//       callbackUrl,
//     });

//     // This part of the code will likely not be reached due to the redirect,
//     // but it's a good fallback to stop the loading state if something unexpected happens.
//     setIsLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <fieldset disabled={isLoading} className="space-y-6">
//         <div>
//           <label htmlFor="email-login" className="block text-sm font-medium mb-1">Email Address</label>
//           <input id="email-login" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={inputStyles}/>
//         </div>
//         <div>
//           <div className="flex justify-between items-center">
//             <label htmlFor="password-login" className="block text-sm font-medium mb-1">Password</label>
//             <Link href="/forgot-password" className="text-sm font-medium text-brand-primary hover:underline">Forgot Password?</Link>
//           </div>
//           <input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className={inputStyles}/>
//         </div>
//       </fieldset>
//       <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-brand-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed">
//         {isLoading && <Loader2 className="animate-spin" size={20} />}
//         {isLoading ? "Logging in..." : "Login"}
//       </button>
//     </form>
//   );
// };

// // Main parent component for the login page
// export default function LoginClient() {
//   return (
//     <main className="w-full bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen py-12 px-4">
//       <div className="w-full max-w-md p-8 sm:p-10 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
//         <div className="text-center">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Login to Your Account</h1>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Welcome back! Please enter your details.</p>
//         </div>
//         <Suspense fallback={ <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-brand-primary" /></div> }>
//           <LoginForm />
//         </Suspense>
//         <SocialLogins />
//         <p className="text-center text-sm text-gray-500 dark:text-gray-400">
//           Don't have an account?{" "}
//           <Link href="/register" className="font-semibold text-brand-primary hover:underline">Register here</Link>
//         </p>
//       </div>
//     </main>
//   );
// }

// // --- SUMMARY OF CHANGES ---
// // - **Restored Server-Side Redirect:** The `handleSubmit` function for credentials login is now extremely simple. It no longer uses `redirect: false`. This lets NextAuth handle the entire redirection flow on the server, which is the most robust and reliable method for both localhost and Vercel.
// // - **Simplified Error Handling:** All complex client-side error logic (`if (result.error)...`) has been removed. The `useEffect` hook now handles displaying toasts for any errors that NextAuth passes back in the URL, which is cleaner and more reliable.
// // - **Consistency:** Both credentials and social logins now use the same reliable, server-managed redirect flow.
"use client";

import { useState, Suspense, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

// --- Social Logins Component ---
const SocialLogins = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const searchParams = useSearchParams();
  // Login ke baad user ko wahan bhejo jahan se wo aya tha, ya phir account page par
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    if (provider === "google") setIsGoogleLoading(true);
    if (provider === "facebook") setIsFacebookLoading(true);

    // NextAuth handle karega redirect flow ko fully
    await signIn(provider, { callbackUrl });
  };

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          disabled={isGoogleLoading || isFacebookLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isGoogleLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <FaGoogle className="text-[#DB4437]" />
          )}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Google
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          disabled={isGoogleLoading || isFacebookLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isFacebookLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <FaFacebook className="text-[#1877F2]" />
          )}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Facebook
          </span>
        </button>
      </div>
    </>
  );
};

// --- Credentials Login Form Component ---
const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Error Handling: Server se wapis aane par agar URL me error ho to Toast dikhayein
  useEffect(() => {
    if (errorParam) {
      if (errorParam === "CredentialsSignin") {
        toast.error("Invalid email or password.");
      } else if (errorParam === "EmailNotVerified") {
        toast.error("Please verify your email address first.");
      } else {
        toast.error("An authentication error occurred. Please try again.");
      }
      // Error dikhane ke baad URL saaf kar dein
      router.replace("/login", { scroll: false });
    }
  }, [errorParam, router]);

  const inputStyles =
    "appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hum yahan 'redirect: false' use NAHI kar rahe.
    // NextAuth ko pura flow handle karne dein.
    // Agar success hoga -> to wo 'callbackUrl' par le jayega.
    // Agar fail hoga -> to wo wapis isi page par layega '?error=...' ke sath.
    await signIn("credentials", {
      email,
      password,
      callbackUrl,
    });

    // Agar redirect ho raha hai to loading state true hi rahegi user ke liye
    // lekin agar network error aya to hume ise false karna pad sakta hai, though usually page reload ho jata hai.
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={isLoading} className="space-y-6">
        <div>
          <label
            htmlFor="email-login"
            className="block text-sm font-medium mb-1"
          >
            Email Address
          </label>
          <input
            id="email-login"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={inputStyles}
          />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <label
              htmlFor="password-login"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            id="password-login"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={inputStyles}
          />
        </div>
      </fieldset>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-brand-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 className="animate-spin" size={20} />}
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

// --- Main Parent Component ---
export default function LoginClient() {
  return (
    <main className="w-full bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md p-8 sm:p-10 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Login to Your Account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Suspense Boundary zaruri hai kyunke hum useSearchParams use kar rahe hain */}
        <Suspense
          fallback={
            <div className="flex justify-center pt-10">
              <Loader2 className="animate-spin text-brand-primary" />
            </div>
          }
        >
          <LoginForm />
          <SocialLogins />
        </Suspense>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-primary hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
