import { useState } from 'react';

type GroupFormProps = {
  initialName?: string;
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
};

const GroupForm = ({ initialName = '', onSubmit, onCancel }: GroupFormProps) => {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onSubmit(name.trim());
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="group-name" className="mb-1 block text-sm font-medium text-slate-700">
          Group Name
        </label>
        <input
          id="group-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sport, Verbs, Travel..."
          autoFocus
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default GroupForm;
