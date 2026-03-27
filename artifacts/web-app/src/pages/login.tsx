import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { toast } from "sonner";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormGroup } from "@/components/ui/form-group";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { mutate: login, isPending } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login({ data }, {
      onSuccess: (res) => {
        localStorage.setItem("auth_token", res.token);
        toast.success("Welcome back!");
        setLocation("/");
      },
      onError: (err: any) => {
        toast.error(err?.error || "Invalid credentials. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Column: Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10 text-center sm:text-left">
            <div className="inline-flex bg-primary/10 p-3 rounded-2xl mb-6 text-primary">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 mb-3">
              Welcome Back
            </h1>
            <p className="text-lg text-slate-500">
              Sign in to manage your institution's faculty and staff.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormGroup label="Email Address" error={errors.email?.message}>
              <Input
                {...register("email")}
                type="email"
                placeholder="you@university.edu"
                disabled={isPending}
                className="h-12 text-lg"
              />
            </FormGroup>

            <FormGroup label="Password" error={errors.password?.message}>
              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                disabled={isPending}
                className="h-12 text-lg"
              />
            </FormGroup>

            <Button type="submit" className="w-full h-12 text-lg mt-2" disabled={isPending}>
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col gap-4 text-center sm:text-left">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link href="/register">
                <span className="text-primary font-semibold hover:underline cursor-pointer">Register here</span>
              </Link>
            </p>
            <p className="text-slate-600">
              Want to join our faculty?{" "}
              <Link href="/teachers/create">
                <span className="text-primary font-semibold hover:underline cursor-pointer">Apply as a Teacher</span>
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Visual */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden items-end p-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 opacity-90 z-10" />
        {/* landing page hero modern university architecture */}
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=1080&fit=crop" 
          alt="University campus" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="relative z-20 max-w-lg">
          <blockquote className="text-3xl font-display font-medium text-white mb-6 leading-tight">
            "EduManage has transformed how we handle our faculty administration, saving us countless hours every week."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-lg">
              DR
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Dr. Robert Chen</p>
              <p className="text-blue-200">Dean of Sciences, Grand University</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
