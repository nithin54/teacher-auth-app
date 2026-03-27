import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateTeacher } from "@workspace/api-client-react";
import { toast } from "sonner";
import { ArrowLeft, GraduationCap, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormGroup } from "@/components/ui/form-group";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const teacherSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  university_name: z.string().min(1, "University name is required"),
  subject: z.string().min(1, "Subject area is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender" }),
  year_joined: z.coerce.number().min(1900, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  bio: z.string().optional(),
});

type TeacherForm = z.infer<typeof teacherSchema>;

export default function CreateTeacher() {
  const [, setLocation] = useLocation();
  const { mutate: createTeacher, isPending } = useCreateTeacher();

  const { register, handleSubmit, formState: { errors } } = useForm<TeacherForm>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      year_joined: new Date().getFullYear(),
    }
  });

  const onSubmit = (data: TeacherForm) => {
    createTeacher({ data }, {
      onSuccess: () => {
        toast.success("Teacher created successfully!");
        setLocation("/teachers");
      },
      onError: (err: any) => {
        toast.error(err?.error || "Failed to create teacher. Check email uniqueness.");
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/teachers">
          <Button variant="ghost" size="sm" className="mb-4 -ml-4 text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Add Faculty Member</h1>
            <p className="text-slate-500 mt-1">Register a new teacher and create their system access account simultaneously.</p>
          </div>
        </div>
      </div>

      <Card className="p-8 shadow-xl shadow-slate-200/50 border-slate-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* User Account Section */}
          <div className="space-y-6">
            <div className="border-b pb-2 mb-4">
              <h2 className="text-xl font-bold text-slate-800">1. Account Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="First Name" error={errors.first_name?.message}>
                <Input {...register("first_name")} disabled={isPending} placeholder="John" />
              </FormGroup>
              <FormGroup label="Last Name" error={errors.last_name?.message}>
                <Input {...register("last_name")} disabled={isPending} placeholder="Smith" />
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Email Address" error={errors.email?.message}>
                <Input {...register("email")} type="email" disabled={isPending} placeholder="john.smith@university.edu" />
              </FormGroup>
              <FormGroup label="Phone Number (Optional)" error={errors.phone?.message}>
                <Input {...register("phone")} type="tel" disabled={isPending} placeholder="+1 (555) 123-4567" />
              </FormGroup>
            </div>

            <FormGroup label="Password" error={errors.password?.message}>
              <Input {...register("password")} type="password" disabled={isPending} placeholder="••••••••" className="max-w-md" />
              <p className="text-xs text-slate-500 mt-1">Minimum 6 characters for initial login.</p>
            </FormGroup>
          </div>

          {/* Teacher Profile Section */}
          <div className="space-y-6 pt-4">
            <div className="border-b pb-2 mb-4">
              <h2 className="text-xl font-bold text-slate-800">2. Professional Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="University / Institution" error={errors.university_name?.message}>
                <Input {...register("university_name")} disabled={isPending} placeholder="Grand University" />
              </FormGroup>
              <FormGroup label="Department / Subject" error={errors.subject?.message}>
                <Input {...register("subject")} disabled={isPending} placeholder="Computer Science" />
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Gender" error={errors.gender?.message}>
                <select 
                  {...register("gender")} 
                  disabled={isPending}
                  className={cn(
                    "flex h-11 w-full rounded-xl border-2 border-input bg-background px-4 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.gender && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10"
                  )}
                >
                  <option value="">Select gender...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </FormGroup>
              <FormGroup label="Year Joined" error={errors.year_joined?.message}>
                <Input {...register("year_joined")} type="number" disabled={isPending} placeholder="2023" />
              </FormGroup>
            </div>

            <FormGroup label="Biography (Optional)" error={errors.bio?.message}>
              <textarea 
                {...register("bio")} 
                disabled={isPending}
                rows={4}
                placeholder="Brief professional background..."
                className={cn(
                  "flex w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.bio && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10"
                )}
              />
            </FormGroup>
          </div>

          <div className="pt-6 flex items-center justify-end gap-4 border-t">
            <Link href="/teachers">
              <Button type="button" variant="ghost" disabled={isPending}>Cancel</Button>
            </Link>
            <Button type="submit" size="lg" disabled={isPending} className="gap-2 px-8">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save & Register
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
