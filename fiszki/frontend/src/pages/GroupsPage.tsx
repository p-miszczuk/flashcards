import { useEffect, useState } from 'react';
import { getGroups, createGroup, updateGroup, deleteGroup, type Group } from '../api/groups';
import GroupCard from '../components/GroupCard';
import GroupForm from '../components/GroupForm';
import Modal from '../components/Modal';

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; group: Group }
  | { type: 'delete'; group: Group }
  | null;

const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);

  const fetchGroups = async () => {
    const data = await getGroups();
    setGroups(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async (name: string) => {
    const group = await createGroup(name);
    setGroups((prev) => [group, ...prev]);
    setModal(null);
  };

  const handleEdit = async (name: string) => {
    if (modal?.type !== 'edit') return;
    const updated = await updateGroup(modal.group.id, name);
    setGroups((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    setModal(null);
  };

  const handleDelete = async () => {
    if (modal?.type !== 'delete') return;
    await deleteGroup(modal.group.id);
    setGroups((prev) => prev.filter((g) => g.id !== modal.group.id));
    setModal(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Flashcards</h1>
          <p className="mt-1 text-slate-500">Manage your vocabulary groups</p>
        </div>
        <button
          onClick={() => setModal({ type: 'create' })}
          aria-label="Add new group"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Group
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
          <p className="text-slate-500">No groups yet.</p>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="mt-3 text-sm font-medium text-indigo-600 hover:underline"
          >
            Create your first group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={(g) => setModal({ type: 'edit', group: g })}
              onDelete={(g) => setModal({ type: 'delete', group: g })}
            />
          ))}
        </div>
      )}

      {modal?.type === 'create' && (
        <Modal title="New Group" onClose={() => setModal(null)}>
          <GroupForm onSubmit={handleCreate} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {modal?.type === 'edit' && (
        <Modal title="Edit Group" onClose={() => setModal(null)}>
          <GroupForm
            initialName={modal.group.name}
            onSubmit={handleEdit}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal title="Delete Group" onClose={() => setModal(null)}>
          <p className="mb-6 text-slate-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-800">"{modal.group.name}"</span>? All
            flashcards in this group will be permanently removed.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setModal(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GroupsPage;
