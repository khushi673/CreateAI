'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Users, FolderKanban, Share2, Globe2, UserPlus, Trash2, Copy, Heart, Search, Wand2, Lock, Link2, Info, Check, Mail } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SAMPLE_IMAGES, SAMPLE_VIDEOS } from '@/data/mockData';
import { chip, DemoBadge, ghostBtn, inputCls, PageHeader, primaryBtn } from '@/components/labs/ui';
import { ModalShell } from '@/components/common/ModalShell';
import { copyText } from '@/lib/clipboard';

type Tab = 'team' | 'project' | 'generation' | 'gallery';
type Access = 'Private' | 'Team' | 'Anyone with link';
const ROLES = ['Owner', 'Admin', 'Editor', 'Viewer'];
const ACCESS: Access[] = ['Private', 'Team', 'Anyone with link'];

interface Member { id: string; name: string; email: string; avatar: string; role: string }

const GALLERY = [
  { id: 'g1', creator: 'Nova Studio', likes: 1280, kind: 'Video', img: SAMPLE_VIDEOS[0].thumbnailUrl, prompt: 'Neon alley chase at night, handheld camera, rain, cinematic grade' },
  { id: 'g2', creator: 'Kira Lane', likes: 940, kind: 'Image', img: SAMPLE_IMAGES[0], prompt: 'Editorial portrait, soft box light, 85mm, muted autumn palette' },
  { id: 'g3', creator: 'Pixel Monk', likes: 731, kind: 'Video', img: SAMPLE_VIDEOS[1].thumbnailUrl, prompt: 'Aerial drone over a glowing city grid, slow orbit, blue hour' },
  { id: 'g4', creator: 'Ada Voss', likes: 602, kind: 'Image', img: SAMPLE_IMAGES[1], prompt: 'Minimal fashion still, sculptural dress, studio backdrop, high contrast' },
  { id: 'g5', creator: 'Rin Hoshi', likes: 512, kind: 'Video', img: SAMPLE_VIDEOS[2].thumbnailUrl, prompt: 'Time-lapse of clouds rolling over mountains, golden hour, crane up' },
  { id: 'g6', creator: 'Theo Marsh', likes: 388, kind: 'Image', img: SAMPLE_IMAGES[3], prompt: 'Runway backstage, motion blur, tungsten lights, documentary style' },
];

const fakeLink = (kind: string, id: string) => `https://aethergen.app/${kind}/${id.replace(/[^a-z0-9]/gi, '').slice(-8)}`;

export const CollaborationView: React.FC = () => {
  const { adminUsers, projects, generations, addToast, setPrompt, setCurrentScreen } = useApp();
  const [tab, setTab] = useState<Tab>('team');

  // team
  const [members, setMembers] = useState<Member[]>([]);
  useEffect(() => {
    setMembers(adminUsers.slice(0, 4).map((u, i) => ({ id: u.id, name: u.name, email: u.email, avatar: u.avatar, role: i === 0 ? 'Owner' : i === 1 ? 'Admin' : 'Editor' })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  const invite = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return addToast('Enter a valid email', undefined, 'warning');
    if (members.some((m) => m.email === email)) return addToast('Already a member', email, 'warning');
    setMembers((p) => [...p, { id: 'inv_' + Date.now(), name: email.split('@')[0], email, avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`, role: inviteRole }]);
    addToast('Invitation sent', `${email} was added as ${inviteRole}.`, 'success');
    setEmail(''); setInviteOpen(false);
  };

  // share project / generation
  const [projId, setProjId] = useState(projects[0]?.id ?? '');
  const [projAccess, setProjAccess] = useState<Record<string, Access>>({});
  const [genId, setGenId] = useState(generations[0]?.id ?? '');
  const proj = projects.find((p) => p.id === projId);
  const gen = generations.find((g) => g.id === genId);
  const access = projAccess[projId] ?? 'Private';
  const copy = async (link: string) => { await copyText(link); addToast('Link copied', link, 'success'); };

  // gallery
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [liked, setLiked] = useState<string[]>([]);
  const shown = useMemo(
    () => GALLERY.filter((g) => (filter === 'All' || g.kind === filter) && (g.prompt + g.creator).toLowerCase().includes(q.toLowerCase())),
    [q, filter]
  );

  const tabs: [Tab, string, React.ElementType][] = [['team', 'Team', Users], ['project', 'Share a project', FolderKanban], ['generation', 'Share a generation', Share2], ['gallery', 'Community gallery', Globe2]];
  const card = 'glass-panel rounded-2xl p-4 sm:p-5';

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <PageHeader
        icon={<Users className="w-6 h-6 text-fuchsia-400" />}
        title="Collaboration"
        badge={<DemoBadge />}
        subtitle="Share projects and see community work. Pick a tab below."
      />
      <div className="flex items-start gap-2 text-[11px] text-zinc-400 bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2">
        <Info className="w-3.5 h-3.5 mt-0.5 text-fuchsia-400 shrink-0" />Demo only: invites and share links are not sent to anyone.
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`${chip(tab === id)} flex items-center gap-1.5 whitespace-nowrap`}><Icon className="w-3.5 h-3.5" />{label}</button>
        ))}
      </div>

      {tab === 'team' && (
        <div className={`${card} space-y-4`}>
          <div className="flex items-center justify-between">
            <div><h2 className="text-sm font-extrabold text-white">Members</h2><p className="text-[11px] text-zinc-500">{members.length} people in this workspace</p></div>
            <button onClick={() => setInviteOpen(true)} className={primaryBtn}><UserPlus className="w-3.5 h-3.5" />Invite member</button>
          </div>
          {members.length === 0 && <p className="text-xs text-zinc-500 py-6 text-center">No members yet. Click Invite member to add the first one.</p>}
          <div className="divide-y divide-zinc-800/80">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-zinc-700" />
                <div className="flex-1 min-w-0"><div className="text-xs font-bold text-white truncate">{m.name}</div><div className="text-[11px] text-zinc-500 truncate">{m.email}</div></div>
                <select
                  value={m.role}
                  disabled={m.role === 'Owner'}
                  onChange={(e) => { setMembers((p) => p.map((x) => (x.id === m.id ? { ...x, role: e.target.value } : x))); addToast('Role updated', `${m.name} is now ${e.target.value}.`, 'success'); }}
                  className={`${inputCls} !w-28`}
                >
                  {ROLES.map((r) => <option key={r} value={r} disabled={r === 'Owner' && m.role !== 'Owner'}>{r}</option>)}
                </select>
                <button
                  aria-label="Remove member"
                  disabled={m.role === 'Owner'}
                  onClick={() => { setMembers((p) => p.filter((x) => x.id !== m.id)); addToast('Member removed', m.name, 'info'); }}
                  className="p-2 rounded-lg text-zinc-500 hover:text-red-300 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:text-zinc-500"
                ><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'project' && (
        <div className={`${card} space-y-4`}>
          {projects.length === 0 ? <p className="text-xs text-zinc-500 py-6 text-center">No projects to share yet. Create one in Projects first.</p> : (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                {projects.map((p) => (
                  <button key={p.id} onClick={() => setProjId(p.id)} className={`flex items-center gap-3 p-2.5 rounded-xl border text-left ${projId === p.id ? 'border-purple-500/60 bg-purple-600/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.coverImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="min-w-0"><div className="text-xs font-bold text-white truncate">{p.name}</div><div className="text-[10px] text-zinc-500">{p.itemCount} generations · {projAccess[p.id] ?? 'Private'}</div></div>
                  </button>
                ))}
              </div>
              {proj && (
                <div className="space-y-3 pt-3 border-t border-zinc-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Access for {proj.name}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ACCESS.map((a) => (
                      <button key={a} onClick={() => { setProjAccess((p) => ({ ...p, [proj.id]: a })); addToast('Access updated', `${proj.name} is now ${a}.`, 'success'); }} className={`${chip(access === a)} flex items-center gap-1.5`}>
                        {a === 'Private' ? <Lock className="w-3 h-3" /> : a === 'Team' ? <Users className="w-3 h-3" /> : <Globe2 className="w-3 h-3" />}{a}
                      </button>
                    ))}
                  </div>
                  {access === 'Private' ? <p className="text-[11px] text-zinc-500">Only you can open this project. Choose Team or Anyone with link to get a share link.</p> : (
                    <div className="flex gap-2"><input readOnly value={fakeLink('p', proj.id)} className={inputCls} /><button onClick={() => copy(fakeLink('p', proj.id))} className={ghostBtn}><Copy className="w-3.5 h-3.5" />Copy</button></div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'generation' && (
        <div className={`${card} space-y-4`}>
          {generations.length === 0 ? <p className="text-xs text-zinc-500 py-6 text-center">Nothing to share yet. Make a generation in Create first.</p> : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 max-h-60 overflow-y-auto">
                {generations.map((g) => (
                  <button key={g.id} onClick={() => setGenId(g.id)} className={`relative rounded-xl overflow-hidden border ${genId === g.id ? 'border-purple-500 ring-1 ring-purple-500' : 'border-zinc-800'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.thumbnailUrl} alt={g.title} className="aspect-square w-full object-cover" />
                    {genId === g.id && <Check className="absolute top-1 right-1 w-4 h-4 p-0.5 rounded-full bg-purple-600 text-white" />}
                  </button>
                ))}
              </div>
              {gen && (
                <div className="space-y-2 pt-3 border-t border-zinc-800">
                  <div className="text-xs font-bold text-white truncate">{gen.title}</div>
                  <div className="flex gap-2"><input readOnly value={fakeLink('g', gen.id)} className={inputCls} /><button onClick={() => copy(fakeLink('g', gen.id))} className={ghostBtn}><Link2 className="w-3.5 h-3.5" />Copy link</button></div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prompts or creators…" className={`${inputCls} !pl-9`} /></div>
            <div className="flex gap-1.5">{['All', 'Video', 'Image'].map((f) => <button key={f} onClick={() => setFilter(f)} className={chip(filter === f)}>{f}</button>)}</div>
          </div>
          {shown.length === 0 ? <p className="text-xs text-zinc-500 py-12 text-center">Nothing matches your search.</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shown.map((g) => {
                const isLiked = liked.includes(g.id);
                return (
                  <div key={g.id} className="glass-panel rounded-2xl overflow-hidden group">
                    <div className="relative aspect-video">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-bold text-white">{g.kind}</span>
                    </div>
                    <div className="p-3 space-y-2.5">
                      <p className="text-[11px] text-zinc-300 line-clamp-2 min-h-[2rem]">{g.prompt}</p>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500">by <span className="text-zinc-200 font-bold">{g.creator}</span></span>
                        <button onClick={() => setLiked((l) => (isLiked ? l.filter((x) => x !== g.id) : [...l, g.id]))} className={`flex items-center gap-1 font-bold ${isLiked ? 'text-pink-400' : 'text-zinc-500 hover:text-pink-300'}`}>
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-400' : ''}`} />{g.likes + (isLiked ? 1 : 0)}
                        </button>
                      </div>
                      <button onClick={() => { setPrompt(g.prompt); setCurrentScreen('create'); addToast('Prompt copied to Create', `"${g.prompt.slice(0, 40)}…" loaded in Create.`, 'success'); }} className={`${ghostBtn} w-full`}>
                        <Wand2 className="w-3.5 h-3.5 text-fuchsia-400" />Remix this prompt
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {inviteOpen && (
      <ModalShell size="sm" onClose={() => setInviteOpen(false)} title="Invite member">
        <div className="space-y-3">
          <div className="relative"><Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /><input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && invite()} placeholder="name@company.com" className={`${inputCls} !pl-9`} /></div>
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className={inputCls}>{ROLES.slice(1).map((r) => <option key={r}>{r}</option>)}</select>
          <button onClick={invite} className={`${primaryBtn} w-full`}>Send invite</button>
        </div>
      </ModalShell>
      )}
    </div>
  );
};
