import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@workspace/api-client-react";
import { toast } from "sonner";
import { GraduationCap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormGroup } from "@/components/ui/form-group";

const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { mutate: registerUser, isPending } = useRegister();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    registerUser({ data }, {
      onSuccess: (res) => {
        localStorage.setItem("auth_token", res.token);
        toast.success("Account created successfully!");
        setLocation("/");
      },
      onError: (err: any) => {
        toast.error(err?.error || "Registration failed. Email might already exist.");
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 border border-slate-100"
        >
          <div className="text-center mb-10">
            <div className="inline-flex bg-primary/10 p-3 rounded-2xl mb-4 text-primary mx-auto">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Create an Account</h1>
            <p className="text-slate-500 mt-2">Get started with your administrative dashboard.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormGroup label="First Name" error={errors.first_name?.message}>
                <Input {...register("first_name")} disabled={isPending} placeholder="Jane" />
              </FormGroup>
              <FormGroup label="Last Name" error={errors.last_name?.message}>
                <Input {...register("last_name")} disabled={isPending} placeholder="Doe" />
              </FormGroup>
            </div>

            <FormGroup label="Email Address" error={errors.email?.message}>
              <Input {...register("email")} type="email" disabled={isPending} placeholder="jane.doe@university.edu" />
            </FormGroup>

            <FormGroup label="Phone Number (Optional)" error={errors.phone?.message}>
              <Input {...register("phone")} type="tel" disabled={isPending} placeholder="+1 (555) 000-0000" />
            </FormGroup>

            <FormGroup label="Password" error={errors.password?.message}>
              <Input {...register("password")} type="password" disabled={isPending} placeholder="••••••••" />
            </FormGroup>

            <Button type="submit" className="w-full h-12 text-lg mt-4" disabled={isPending}>
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-slate-600 mt-8">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-primary font-semibold hover:underline cursor-pointer">Sign in</span>
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
