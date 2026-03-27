import { Link } from "wouter";
import { useListTeachers } from "@workspace/api-client-react";
import { format } from "date-fns";
import { GraduationCap, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Teachers() {
  const { data: teachers, isLoading } = useListTeachers();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Faculty Members</h1>
          <p className="text-slate-500 mt-1">Complete roster of institutional teachers and their details.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search teachers..." className="pl-10 h-10" />
          </div>
          <Link href="/teachers/create">
            <Button className="h-10 shrink-0 gap-2">
              <Plus className="w-4 h-4" /> New Teacher
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading faculty roster...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Department / Subject</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers?.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-display">
                      {teacher.user.first_name[0]}{teacher.user.last_name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {teacher.user.first_name} {teacher.user.last_name}
                      </div>
                      <div className="text-xs text-slate-500">{teacher.user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                    {teacher.subject}
                  </span>
                </TableCell>
                <TableCell className="text-slate-700 font-medium">
                  {teacher.university_name}
                </TableCell>
                <TableCell>
                  <span className="capitalize text-sm text-slate-600">{teacher.gender}</span>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-slate-900">{teacher.year_joined}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Added {format(new Date(teacher.created_at), "MMM yyyy")}</div>
                </TableCell>
              </TableRow>
            ))}
            {teachers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <GraduationCap className="h-10 w-10 text-slate-300 mb-3" />
                    <p className="font-medium text-lg text-slate-900">No teachers found</p>
                    <p className="text-sm mb-4">Get started by adding a new faculty member.</p>
                    <Link href="/teachers/create">
                      <Button variant="outline" size="sm">Add Teacher</Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </motion.div>
  );
}
