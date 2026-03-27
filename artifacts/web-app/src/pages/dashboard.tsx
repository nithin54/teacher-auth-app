import { Link } from "wouter";
import { useListUsers, useListTeachers } from "@workspace/api-client-react";
import { Users, GraduationCap, ArrowRight, Activity, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { data: users, isLoading: usersLoading } = useListUsers();
  const { data: teachers, isLoading: teachersLoading } = useListTeachers();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Hero Section */}
      <motion.div variants={item} className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-900 opacity-90" />
        <div className="relative p-10 sm:p-16 z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight mb-4 text-white">
              Welcome to EduManage
            </h1>
            <p className="text-lg text-blue-100 font-medium leading-relaxed">
              Your centralized hub for managing institutional data. Monitor staff metrics, oversee users, and streamline administration in one secure place.
            </p>
          </div>
          <div className="flex flex-col gap-4 min-w-[200px]">
            <Link href="/teachers/create">
              <div className="bg-white text-blue-900 px-6 py-4 rounded-xl font-bold text-center cursor-pointer hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl active:scale-[0.98]">
                Add New Teacher
              </div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Users</p>
            <h3 className="text-4xl font-display font-bold text-slate-900">
              {usersLoading ? "..." : users?.length || 0}
            </h3>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Teachers</p>
            <h3 className="text-4xl font-display font-bold text-slate-900">
              {teachersLoading ? "..." : teachers?.length || 0}
            </h3>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">System Status</p>
            <h3 className="text-3xl font-display font-bold text-slate-900 mt-2 flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
              Healthy
            </h3>
          </div>
        </Card>
      </motion.div>

      {/* Quick Links Section */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display text-slate-900">Recent Users</h3>
            <Link href="/users">
              <span className="text-primary text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer">
                View all <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              {usersLoading ? (
                <div className="p-6 text-center text-muted-foreground">Loading...</div>
              ) : (
                <div className="divide-y">
                  {users?.slice(0, 4).map(user => (
                    <div key={user.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {user.first_name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                      {user.is_active && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Active</span>
                      )}
                    </div>
                  ))}
                  {users?.length === 0 && <div className="p-6 text-center text-slate-500">No users found.</div>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display text-slate-900">Department Teachers</h3>
            <Link href="/teachers">
              <span className="text-primary text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer">
                View all <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              {teachersLoading ? (
                <div className="p-6 text-center text-muted-foreground">Loading...</div>
              ) : (
                <div className="divide-y">
                  {teachers?.slice(0, 4).map(teacher => (
                    <div key={teacher.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{teacher.user.first_name} {teacher.user.last_name}</p>
                        <p className="text-sm text-slate-500">{teacher.subject} &bull; {teacher.university_name}</p>
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        Joined {teacher.year_joined}
                      </div>
                    </div>
                  ))}
                  {teachers?.length === 0 && <div className="p-6 text-center text-slate-500">No teachers found.</div>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
