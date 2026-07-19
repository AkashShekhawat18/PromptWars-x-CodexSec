"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, MoreVertical, CheckCircle, XCircle, Ban, Shield, Loader2 } from "lucide-react";
import { clsx } from "clsx";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", search],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users?search=${search}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, role }: { id: string, status?: string, role?: string }) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, role })
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
          <p className="text-sm text-[#8A8A93]">Approve, reject, or modify user roles.</p>
        </div>
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A93]" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#8A8A93]" /></div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#8A8A93] uppercase bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.users?.map((user: any) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{user.name || "Unnamed"}</span>
                      <span className="text-xs text-[#8A8A93]">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium border",
                      user.role === "SUPER_ADMIN" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                      user.role === "ADMIN" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium border flex items-center w-fit gap-1",
                      user.status === "ACTIVE" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      user.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                      {user.status === "ACTIVE" && <CheckCircle className="w-3 h-3" />}
                      {user.status === "PENDING" && <Loader2 className="w-3 h-3 animate-spin" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#8A8A93]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.status === "PENDING" && (
                        <>
                          <button 
                            onClick={() => updateMutation.mutate({ id: user.id, status: "ACTIVE" })}
                            className="p-1.5 hover:bg-green-500/20 text-green-400 rounded-md transition-colors"
                            title="Approve User"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateMutation.mutate({ id: user.id, status: "REJECTED" })}
                            className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-md transition-colors"
                            title="Reject User"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {user.status === "ACTIVE" && (
                        <button 
                          onClick={() => updateMutation.mutate({ id: user.id, status: "SUSPENDED" })}
                          className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-md transition-colors"
                          title="Suspend User"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => updateMutation.mutate({ id: user.id, role: user.role === "USER" ? "ADMIN" : "USER" })}
                        className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-md transition-colors ml-2"
                        title="Toggle Admin Role"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data?.users?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#8A8A93]">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
