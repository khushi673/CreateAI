'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AdminUserItem } from '@/types';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  UserCheck, 
  UserX, 
  Zap, 
  Crown, 
  X, 
  Sparkles, 
  ShieldAlert,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminUserManagement: React.FC = () => {
  const { adminUsers, toggleUserStatus, adjustUserCredits, updateUserPlan } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');

  // Modal States
  const [selectedUserForCredits, setSelectedUserForCredits] = useState<AdminUserItem | null>(null);
  const [creditDelta, setCreditDelta] = useState<number>(100);
  const [creditReason, setCreditReason] = useState<string>('Admin bonus grant');

  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUserItem | null>(null);

  // Filtered Users List
  const filteredUsers = adminUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesPlan = planFilter === 'All' || u.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleApplyCreditAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForCredits) return;
    adjustUserCredits(selectedUserForCredits.id, creditDelta, creditReason);
    setSelectedUserForCredits(null);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-400" />
            <h2 className="text-xl font-black text-white">User Account Administration</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Search users, monitor subscriptions & credit balances, suspend accounts, and adjust credits manually.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
            Total Users: <strong className="text-white">{adminUsers.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-mono">
            Active: <strong className="text-white">{adminUsers.filter((u) => u.status === 'Active').length}</strong>
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 px-2 font-bold uppercase">Status:</span>
            {['All', 'Active', 'Suspended'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 px-2 font-bold uppercase">Plan:</span>
            {['All', 'Free', 'Pro', 'Enterprise'].map((pl) => (
              <button
                key={pl}
                onClick={() => setPlanFilter(pl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  planFilter === pl ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {pl}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/80 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Role / Email</th>
              <th className="py-3.5 px-4">Plan Tier</th>
              <th className="py-3.5 px-4">Credit Balance</th>
              <th className="py-3.5 px-4">Generations</th>
              <th className="py-3.5 px-4">Account Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80 text-xs">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500 font-semibold">
                  No users found matching your search filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-900/50 transition-colors">
                  
                  {/* User Profile */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-rose-500/30">
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <button
                          onClick={() => setSelectedUserDetail(u)}
                          className="font-bold text-white hover:text-rose-300 transition-colors text-left"
                        >
                          {u.name}
                        </button>
                        <p className="text-[10px] text-zinc-500 font-mono">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email & Role */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-zinc-200">{u.role}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{u.email}</p>
                  </td>

                  {/* Plan Tier Selector */}
                  <td className="py-3.5 px-4">
                    <select
                      value={u.plan}
                      onChange={(e) => updateUserPlan(u.id, e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-lg py-1 px-2 text-xs font-bold text-purple-300 focus:outline-none focus:border-rose-500 cursor-pointer"
                    >
                      <option value="Free">Free Plan</option>
                      <option value="Pro">Pro Creator</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </td>

                  {/* Credit Balance */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-extrabold text-white text-sm">{u.credits}</span>
                      <span className="text-[10px] text-zinc-400 uppercase">Credits</span>
                    </div>
                  </td>

                  {/* Total Generations */}
                  <td className="py-3.5 px-4 font-mono text-zinc-300">
                    {u.totalGenerations} renders
                  </td>

                  {/* Account Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      u.status === 'Active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                    }`}>
                      {u.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {u.status}
                    </span>
                  </td>

                  {/* Actions Buttons */}
                  <td className="py-3.5 px-4 text-right space-x-1">
                    {/* Add/Deduct Credits */}
                    <button
                      onClick={() => setSelectedUserForCredits(u)}
                      className="py-1 px-2.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-[11px] font-bold transition-all"
                      title="Adjust Credits"
                    >
                      ⚡ Adjust Credits
                    </button>

                    {/* Suspend / Activate Toggle */}
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`py-1 px-2.5 rounded-lg text-[11px] font-bold border transition-all ${
                        u.status === 'Active'
                          ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border-rose-800'
                          : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: Adjust Credits */}
      {selectedUserForCredits && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-panel rounded-3xl border border-zinc-800 p-6 relative shadow-2xl overflow-hidden">
            
            <button
              onClick={() => setSelectedUserForCredits(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Adjust User Credits</h3>
                <p className="text-xs text-zinc-400">{selectedUserForCredits.name} ({selectedUserForCredits.email})</p>
              </div>
            </div>

            <form onSubmit={handleApplyCreditAdjustment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Credit Amount (Positive to add, Negative to deduct)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCreditDelta(-100)}
                    className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-rose-400"
                  >
                    -100
                  </button>
                  <input
                    type="number"
                    required
                    value={creditDelta}
                    onChange={(e) => setCreditDelta(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono text-center focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setCreditDelta(100)}
                    className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-emerald-400"
                  >
                    +100
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  placeholder="e.g. VIP Creator Bonus or Refund for failed job"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForCredits(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-950"
                >
                  Apply Credit Change
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: User Detail Inspection */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg glass-panel rounded-3xl border border-zinc-800 p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedUserDetail(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-purple-500 shrink-0">
                <img src={selectedUserDetail.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{selectedUserDetail.name}</h3>
                <p className="text-xs text-purple-300 font-mono">{selectedUserDetail.email}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{selectedUserDetail.role} • Joined {selectedUserDetail.joinedAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Subscription Tier</span>
                <span className="font-extrabold text-white">{selectedUserDetail.plan} Plan</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Credit Balance</span>
                <span className="font-extrabold text-amber-400">⚡ {selectedUserDetail.credits} Credits</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Total Generations Rendered</span>
                <span className="font-bold text-white">{selectedUserDetail.totalGenerations} clips</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Account Status</span>
                <span className={`font-bold ${selectedUserDetail.status === 'Active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedUserDetail.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
              <button
                onClick={() => {
                  setSelectedUserForCredits(selectedUserDetail);
                  setSelectedUserDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Adjust Credits
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
