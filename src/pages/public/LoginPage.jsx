import React from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema} from "@/schema/loginSchema.js";
import {useAuth} from "@/hooks/useAuthQuery.js";
import useAuthStore from "../../store/useAuthStore.js";
import {Navigate} from "react-router";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gsap } from "gsap";
import {useGSAP} from "@gsap/react";
import {motion} from "motion/react";
function LoginPage() {
 const form = useForm({
 resolver: zodResolver(loginSchema),
 defaultValues: {
 email: "",
 password: "",
 },
 });

 const {loginMutation, isLoginPending} = useAuth();
 const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

 const onSubmit = (data) => {
 loginMutation(data);
 gsap.to(".login-form", {
 opacity: 0,
 scale: 0,
 transformOrigin: "50% 50%",
 duration: 0.5,
 });
 };
 useGSAP(() => {
 gsap.set(".login-form", {
 opacity: 1,
 scale: 1,
 });
 if (isAuthenticated) {
 gsap.to(".login-form", {
 opacity: 0,
 scale: 0,
 transformOrigin: "50% 50%",
 duration: 0.5,
 });
 }else {
 gsap.from(".login-form", {
 opacity: 0,
 scale: 0,
 transformOrigin: "50% 50%",
 duration: 0.5,
 });
 }
 }, []);

 if (isAuthenticated) {
 return <Navigate to="/" />;
 }



 return (
 <div className="login-form bg-gray-100 min-h-screen w-screen flex items-center justify-center font-sans transition-colors duration-200">
 <Card className="w-full max-w-sm mx-4 bg-white shadow-xl">
 <div className="overflow-hidden flex items-center justify-center mt-5 [perspective:800px]">
 <motion.img
 src="/logo.webp"
 alt="Rotating 3D-like logo with Framer Motion"
 height={120}
 width={120}
 className="object-contain"
 animate={{ rotateY: 360 }}
 transition={{
 repeat: Infinity,
 repeatType: "loop",
 duration: 2,
 ease: "linear",
 }}
 style={{
 perspective: 500,
 transformStyle: "preserve-3d",
 }}
 />
 </div>
 <CardHeader>
 <CardTitle className="text-2xl font-bold text-center text-gray-900 ">
 Welcome to Admin Panel
 </CardTitle>
 <p className="text-sm text-center mt-2 text-gray-600 ">
 Please login to continue.
 </p>
 </CardHeader>
 <CardContent>
 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
 <FormField
 control={form.control}
 name="email"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Email</FormLabel>
 <FormControl>
 <Input placeholder="name@example.com" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={form.control}
 name="password"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Password</FormLabel>
 <FormControl>
 <Input
 type="password"
 placeholder="********"
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <div className="text-right -mt-2">
 <a
 href="#"
 className="text-sm font-medium text-blue-600 hover:underline :text-blue-300 transition-colors"
 >
 Forgot password?
 </a>
 </div>

 {/* Display API error */}
 {form.formState.errors.root && (
 <div className="text-red-600 text-sm text-center">
 {form.formState.errors.root.message}
 </div>
 )}

 <Button
 type="submit"
 disabled={isLoginPending}
 className="mt-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
 >
 {isLoginPending ? "Logging in..." : "Login"}
 </Button>
 </form>
 </Form>
 </CardContent>
 </Card>
 </div>
 );
}

export default LoginPage;