import { useNavigate } from 'react-router-dom';
import type { Group } from '../api/groups';

type GroupCardProps = {
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const GroupCard = ({ group, onEdit, onDelete }: GroupCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => navigate(`/groups/${group.id}`);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(group);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(group);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open group ${group.name}`}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
    >
      <div>
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800">{group.name}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {group._count.cards} {group._count.cards === 1 ? 'card' : 'cards'}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-400">{formatDate(group.createdAt)}</span>
        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={handleEditClick}
            aria-label={`Edit group ${group.name}`}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleEditClick(e as unknown as React.MouseEvent)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            aria-label={`Delete group ${group.name}`}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleDeleteClick(e as unknown as React.MouseEvent)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
