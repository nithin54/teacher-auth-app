import { useListUsers } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Users as UsersIcon, Search } from "lucide-react";
import { motion } from "framer-motion";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function Users() {
  const { data: users, isLoading } = useListUsers();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">System Users</h1>
          <p className="text-slate-500 mt-1">Manage and view all registered users in the platform.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search users..." className="pl-10" />
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading users data...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs text-slate-500">
                  #{user.id.toString().padStart(4, '0')}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-slate-900">
                    {user.first_name} {user.last_name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-600">{user.email}</div>
                  {user.phone && <div className="text-xs text-slate-400 mt-0.5">{user.phone}</div>}
                </TableCell>
                <TableCell>
                  {user.is_active ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right text-slate-500 text-sm">
                  {format(new Date(user.created_at), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))}
            {users?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <UsersIcon className="h-10 w-10 text-slate-300 mb-3" />
                    <p className="font-medium text-lg">No users found</p>
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
