import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gsap } from "gsap";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

// Login API function
const loginUser = async ({ email, password }) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();

  return data;
};

const LoginForm = ({ onLoginSuccess }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Use mutation for login API call
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Animate form out on success
      gsap.to(".login-form", {
        scale: 0.1,
        duration: 0.8,
        opacity: 0,
        onComplete: () => {
          // Call the parent callback with user data from API response
          onLoginSuccess({
            email: data.user?.email || form.getValues().email,
            name: data.user?.name || form.getValues().email.split("@")[0],
            ...data.user, // Include any other user data from API
          });
        },
      });
    },
    onError: (error) => {
      // You can show error message to user here
      form.setError("root", {
        type: "manual",
        message: error.message || "Login failed. Please try again.",
      });
    },
  });

  function onSubmit(values) {
    // Trigger the login mutation
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  }
  return (
    <div className="login-form bg-slate-200 min-h-screen w-full flex items-center justify-center font-sans">
      <Card className="w-full max-w-sm mx-4 bg-white">
        <div className="h-20 w-full"></div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center mt-10">
            Welcome to Admin Panel
          </CardTitle>
          <p className="text-sm text-center mt-2">Please login to continue.</p>
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
                  className="text-sm font-medium text-blue-600 hover:underline"
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
                className="mt-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
