'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MediaType, GenerationItem, Project, ProjectFolder } from '@/types';
import {
  ArrowLeft, Folder, FolderOpen, FolderPlus, Film, Image as ImageIcon, Music, Pencil, Trash2,
  Eye, FolderInput, X, Layers, Wand2, ChevronRight, Check,
} from 'lucide-react';
import { ConfirmDialog, TextPromptDialog, DialogShell } from '@/components/common/Dialogs';

const STARTER_FOLDERS = ['Character References', 'Outfit 01', 'Outfit 02', 'Scene 01', 'Scene 02'];
const TYPE_TABS: { id: 'all' | MediaType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Videos' },
  { id: 'audio', label: 'Audio' },
];

type Dlg =
  | { kind: 'new'; parentId: string | null }
  | { kind: 'rename'; folder: ProjectFolder }
  | { kind: 'delete'; folder: ProjectFolder }
  | { kind: 'move'; item: GenerationItem }
  | null;

const flatten = (folders: ProjectFolder[], parentId: string | null = null, depth = 0): { folder: ProjectFolder; depth: number }[] =>
  folders
    .filter((f) => f.parentId === parentId)
    .flatMap((f) => [{ folder: f, depth }, ...flatten(folders, f.id, depth + 1)]);

const pathOf = (folders: ProjectFolder[], id: string | null): ProjectFolder[] => {
  const out: ProjectFolder[] = [];
  let cur = folders.find((f) => f.id === id);
  while (cur) {
    out.unshift(cur);
    const pid: string | null = cur.parentId;
    cur = folders.find((f) => f.id === pid);
  }
  return out;
};

export const ProjectDetailView: React.FC = () => {
  const {
    selectedProjectDetail, setCurrentScreen, openResult, createFolder, renameFolder, deleteFolder,
    moveItemToFolder, removeFromProject, setGenerateTarget, addToast,
  } = useApp();

  const [folderId, setFolderId] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | MediaType>('all');
  const [dlg, setDlg] = useState<Dlg>(null);

  const proj: Project | null = selectedProjectDetail;
  const folders = useMemo(() => proj?.folders ?? [], [proj]);
  const activeFolderId = folderId && folders.some((f) => f.id === folderId) ? folderId : null;
  const tree = useMemo(() => flatten(folders), [folders]);

  if (!proj) {
    return (
      <div className="p-12 text-center">
        <p className="text-zinc-400 text-sm">No project selected.</p>
        <button onClick={() => setCurrentScreen('projects')} className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold">
          Back to Projects
        </button>
      </div>
    );
  }

  const folderName = (id?: string) => folders.find((f) => f.id === id)?.name;
  const countIn = (id: string | null) => (id === null ? proj.items.length : proj.items.filter((i) => i.folderId === id).length);
  const crumbs = pathOf(folders, activeFolderId);

  const visible = proj.items.filter(
    (i) => (activeFolderId === null || i.folderId === activeFolderId) && (tab === 'all' || i.mediaType === tab)
  );

  const generateHere = () => {
    setGenerateTarget({ projectId: proj.id, folderId: activeFolderId });
    setCurrentScreen('create');
    addToast(`Saving to ${proj.name}${activeFolderId ? ` › ${folderName(activeFolderId)}` : ''}`, 'Choose image, video or audio in Create.', 'info');
  };

  const createStarters = () => {
    STARTER_FOLDERS.forEach((n) => createFolder(proj.id, n, null));
  };

  const typeIcon = (t: MediaType) =>
    t === 'video' ? <Film className="w-3 h-3 text-purple-400" /> : t === 'audio' ? <Music className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />;

  return (
    <div className="space-y-5 pb-20">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
        <button onClick={() => setCurrentScreen('projects')} className="flex items-center gap-1 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Projects
        </button>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <button onClick={() => setFolderId(null)} className={`hover:text-white transition-colors ${!activeFolderId ? 'text-white font-bold' : ''}`}>{proj.name}</button>
        {crumbs.map((c, i) => (
          <React.Fragment key={c.id}>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <button onClick={() => setFolderId(c.id)} className={`hover:text-white transition-colors ${i === crumbs.length - 1 ? 'text-white font-bold' : ''}`}>{c.name}</button>
          </React.Fragment>
        ))}
      </nav>

      {/* Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-zinc-900 to-indigo-950/80 border border-purple-800/40 flex items-start gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-purple-500/50 bg-black">
          <img src={proj.coverImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-white">{proj.name}</h1>
          <p className="text-xs text-zinc-300 mt-1 max-w-xl">{proj.description}</p>
          <p className="text-[11px] text-zinc-400 mt-1 max-w-xl">Pick a folder on the left, then create new work in it or move existing work into it.</p>
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span className="text-[10px] text-zinc-400">{proj.items.length} generations · {folders.length} folders</span>
            {proj.tags.map((t, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 font-mono border border-purple-800/60">#{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Generate inside panel */}
      <div className="p-5 rounded-3xl glass-panel border border-purple-500/30 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><Wand2 className="w-4 h-4 text-purple-400" /> Create in this project</h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              New results are saved to <span className="text-purple-300 font-semibold">{proj.name}{activeFolderId ? ` › ${folderName(activeFolderId)}` : ''}</span>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={generateHere} className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"><Wand2 className="w-4 h-4" /> Create here</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        {/* Folder tree */}
        <aside className="rounded-2xl glass-panel border border-zinc-800 p-3 h-fit">
          <div className="flex items-center justify-between px-1 pb-2 mb-1 border-b border-zinc-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Folders</span>
            <button onClick={() => setDlg({ kind: 'new', parentId: null })} className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"><FolderPlus className="w-3.5 h-3.5" /> New folder</button>
          </div>
          <button
            onClick={() => setFolderId(null)}
            className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors ${activeFolderId === null ? 'bg-purple-600/20 text-white border border-purple-500/40' : 'text-zinc-300 hover:bg-zinc-800/70 border border-transparent'}`}
          >
            <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-purple-400" /> All files</span>
            <span className="text-[10px] text-zinc-500">{countIn(null)}</span>
          </button>
          <div className="mt-1 space-y-0.5">
            {tree.map(({ folder: f, depth }) => {
              const active = activeFolderId === f.id;
              return (
                <div key={f.id} style={{ paddingLeft: depth * 14 }} className="group">
                  <div className={`flex items-center gap-1 rounded-lg border transition-colors ${active ? 'bg-purple-600/20 border-purple-500/40' : 'border-transparent hover:bg-zinc-800/70'}`}>
                    <button onClick={() => setFolderId(f.id)} className="flex-1 min-w-0 flex items-center gap-2 px-2.5 py-2 text-xs text-left">
                      {active ? <FolderOpen className="w-4 h-4 text-purple-400 shrink-0" /> : <Folder className="w-4 h-4 text-zinc-400 shrink-0" />}
                      <span className={`truncate ${active ? 'text-white font-semibold' : 'text-zinc-300'}`}>{f.name}</span>
                      <span className="ml-auto text-[10px] text-zinc-500">{countIn(f.id)}</span>
                    </button>
                    <div className="flex pr-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button aria-label="New subfolder" title="New subfolder" onClick={() => setDlg({ kind: 'new', parentId: f.id })} className="p-1 text-zinc-400 hover:text-white"><FolderPlus className="w-3.5 h-3.5" /></button>
                      <button aria-label="Rename folder" title="Rename" onClick={() => setDlg({ kind: 'rename', folder: f })} className="p-1 text-zinc-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                      <button aria-label="Delete folder" title="Delete" onClick={() => setDlg({ kind: 'delete', folder: f })} className="p-1 text-zinc-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {folders.length === 0 && (
            <div className="mt-3 p-3 rounded-xl bg-zinc-950/60 border border-dashed border-zinc-700 text-center space-y-2">
              <p className="text-[11px] text-zinc-400">No folders yet. Start with suggested ones (Character References, Outfit, Scene).</p>
              <button onClick={createStarters} className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold">Create starter folders</button>
            </div>
          )}
          {activeFolderId && (
            <button onClick={() => setDlg({ kind: 'new', parentId: activeFolderId })} className="mt-3 w-full px-2.5 py-2 rounded-lg border border-dashed border-zinc-700 hover:border-purple-500/60 text-[11px] text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors">
              <FolderPlus className="w-3.5 h-3.5" /> New subfolder in {folderName(activeFolderId)}
            </button>
          )}
        </aside>

        {/* Items */}
        <section className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-white">{activeFolderId ? folderName(activeFolderId) : 'All files'} <span className="text-zinc-500 font-normal">({visible.length})</span></h2>
            <div className="flex gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
              {TYPE_TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${tab === t.id ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'}`}>{t.label}</button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="p-10 text-center glass-panel rounded-3xl border border-zinc-800 space-y-3">
              <Folder className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">{proj.items.length === 0 ? 'This project is empty' : 'This folder is empty'}</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                {proj.items.length === 0
                  ? 'Click Create here to make your first generation. You can also save one from History.'
                  : 'Click Create here, move a generation into this folder, or change the filter above.'}
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                <button onClick={() => generateHere()} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold">Create here</button>
                {folders.length === 0 && <button onClick={createStarters} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold">Create starter folders</button>}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {visible.map((item) => (
                <div key={item.id} className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden group hover:border-purple-500/40 transition-all flex flex-col shadow-xl">
                  <div onClick={() => openResult(item)} className="relative aspect-video bg-black cursor-pointer overflow-hidden">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                      {typeIcon(item.mediaType)}<span className="capitalize">{item.mediaType}</span>
                    </div>
                    {activeFolderId === null && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-semibold text-purple-200 flex items-center gap-1 max-w-[60%]">
                        <Folder className="w-3 h-3 shrink-0" /><span className="truncate">{folderName(item.folderId) ?? 'Unfiled'}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mt-0.5">{item.prompt}</p>
                    </div>
                    <div className="space-y-1.5 text-[11px] font-bold">
                      <button onClick={() => openResult(item)} className="w-full px-2 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-1 transition-colors"><Eye className="w-3.5 h-3.5" /> Open</button>
                      <div className="flex items-center justify-between px-1 font-semibold">
                        <button onClick={() => setDlg({ kind: 'move', item })} className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"><FolderInput className="w-3.5 h-3.5" /> Move to folder</button>
                        <button onClick={() => removeFromProject(proj.id, item.id)} className="text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"><X className="w-3.5 h-3.5" /> Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {dlg?.kind === 'new' && (
        <TextPromptDialog
          title={dlg.parentId ? `New subfolder in ${folderName(dlg.parentId)}` : 'New folder'}
          label="Folder name"
          placeholder="e.g. Outfit 03"
          submitLabel="Create"
          onSubmit={(v) => {
            const f = createFolder(proj.id, v, dlg.parentId);
            setFolderId(f.id);
          }}
          onClose={() => setDlg(null)}
        />
      )}
      {dlg?.kind === 'rename' && (
        <TextPromptDialog title="Rename folder" label="Folder name" initial={dlg.folder.name} onSubmit={(v) => renameFolder(proj.id, dlg.folder.id, v)} onClose={() => setDlg(null)} />
      )}
      {dlg?.kind === 'delete' && (
        <ConfirmDialog
          title="Delete folder?"
          message={`"${dlg.folder.name}" will be deleted. Its files and subfolders move up to the parent level.`}
          confirmLabel="Delete folder"
          onConfirm={() => deleteFolder(proj.id, dlg.folder.id)}
          onClose={() => setDlg(null)}
        />
      )}
      {dlg?.kind === 'move' && (
        <DialogShell title="Move to folder" onClose={() => setDlg(null)}>
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {[{ id: null as string | null, name: 'Project root (unfiled)', depth: 0 }, ...tree.map((t) => ({ id: t.folder.id as string | null, name: t.folder.name, depth: t.depth + 1 }))].map((o) => {
              const current = (dlg.item.folderId ?? null) === o.id;
              return (
                <button
                  key={o.id ?? 'root'}
                  style={{ paddingLeft: 12 + o.depth * 14 }}
                  onClick={() => {
                    moveItemToFolder(proj.id, dlg.item.id, o.id);
                    setDlg(null);
                  }}
                  className={`w-full flex items-center justify-between pr-3 py-2 rounded-lg text-xs border transition-colors ${current ? 'bg-purple-950/40 border-purple-500 text-white' : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-600'}`}
                >
                  <span className="flex items-center gap-2"><Folder className="w-3.5 h-3.5 text-zinc-400" />{o.name}</span>
                  {current && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </button>
              );
            })}
          </div>
        </DialogShell>
      )}
    </div>
  );
};
