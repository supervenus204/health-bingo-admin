import { useChallenges } from '@/hooks/useChallenges';
import React, { useState, useMemo, useCallback } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Challenge, ChallengeStatus } from '@/types';
import SortableTable, { SortableColumn, SortDirection } from '@/components/SortableTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Play, Trash2, Edit } from 'lucide-react';

const ChallengeManagement: React.FC = () => {
  const {
    challenges,
    currentPage,
    setCurrentPage,
    pageSize,
    total,
    totalPages,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    startNextWeek,
    deleteChallenge,
    updateChallengeStatus,
  } = useChallenges();

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof Challenge | string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const statusOptions: Array<{ value: ChallengeStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'finish', label: 'Finished' },
    { value: 'pending', label: 'Pending' },
    { value: 'unpaid', label: 'Unpaid' },
  ];

  const getValidStatusTransitions = (currentStatus: ChallengeStatus): ChallengeStatus[] => {
    const transitions: Record<ChallengeStatus, ChallengeStatus[]> = {
      unpaid: ['pending', 'finish'],
      pending: ['unpaid', 'active', 'inactive', 'finish'],
      active: ['inactive', 'finish'],
      inactive: ['active', 'finish'],
      finish: [],
    };
    return transitions[currentStatus] || [];
  };

  const getStatusColor = (status: ChallengeStatus) => {
    const colors: Record<ChallengeStatus, string> = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      finish: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      unpaid: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStartNextWeek = useCallback(async (challengeId: string) => {
    if (!confirm('Are you sure you want to start the next week for this challenge?')) {
      return;
    }
    try {
      setActionLoading(challengeId);
      await startNextWeek(challengeId);
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setActionLoading(null);
    }
  }, [startNextWeek]);

  const handleDelete = useCallback(async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      return;
    }
    try {
      setActionLoading(challengeId);
      await deleteChallenge(challengeId);
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setActionLoading(null);
    }
  }, [deleteChallenge]);

  const handleStatusChange = useCallback(async (challengeId: string, newStatus: ChallengeStatus) => {
    try {
      setActionLoading(challengeId);
      await updateChallengeStatus(challengeId, newStatus);
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setActionLoading(null);
    }
  }, [updateChallengeStatus]);

  const handleSort = useCallback((columnKey: string, direction: SortDirection) => {
    if (direction === null) {
      setSortColumn(null);
      setSortDirection(null);
    } else {
      setSortColumn(columnKey);
      setSortDirection(direction);
    }
  }, []);

  const columns: SortableColumn<Challenge>[] = useMemo(
    () => [
      {
        key: 'challenge',
        label: 'Challenge',
        sortable: false,
        render: (_, challenge) => (
          <div className="flex items-center">
            {challenge.image && (
              <img
                src={challenge.image}
                alt={challenge.title}
                className="h-10 w-10 rounded-lg object-cover mr-3"
              />
            )}
            <div>
              <div className="text-sm font-medium text-text-primary">
                {challenge.title}
              </div>
              {challenge.category && (
                <div className="text-xs text-text-secondary">
                  {challenge.category.name}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        key: 'organizer',
        label: 'Organizer',
        sortable: false,
        render: (_, challenge) =>
          challenge.organizer ? (
            <div>
              <div className="text-sm text-text-primary">
                {challenge.organizer.first_name} {challenge.organizer.last_name}
              </div>
              <div className="text-xs text-text-secondary">
                {challenge.organizer.email}
              </div>
            </div>
          ) : (
            <span className="text-sm text-text-secondary">N/A</span>
          ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (_, challenge) => (
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
              challenge.status
            )}`}
          >
            {challenge.status}
          </span>
        ),
      },
      {
        key: 'plan',
        label: 'Plan',
        sortable: true,
        render: (_, challenge) => (
          <span className="text-sm text-text-primary capitalize">
            {challenge.plan}
          </span>
        ),
      },
      {
        key: 'duration',
        label: 'Duration',
        sortable: true,
        render: (_, challenge) => (
          <span className="text-sm text-text-primary">
            {challenge.duration} weeks
          </span>
        ),
      },
      {
        key: 'invitation_code',
        label: 'Invitation Code',
        sortable: true,
        render: (_, challenge) => (
          <span className="text-sm font-mono text-text-primary">
            {challenge.invitation_code}
          </span>
        ),
      },
      {
        key: 'created_at',
        label: 'Created',
        sortable: true,
        render: (_, challenge) => (
          <span className="text-sm text-text-secondary">
            {formatDate(challenge.createdAt)}
          </span>
        ),
      },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        render: (_, challenge) => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={actionLoading === challenge.id}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(challenge.status === 'pending' ||
                  challenge.status === 'active' ||
                  challenge.status === 'inactive') && (
                  <DropdownMenuItem
                    onClick={() => handleStartNextWeek(challenge.id)}
                    disabled={actionLoading === challenge.id}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Next Week
                  </DropdownMenuItem>
                )}
                {getValidStatusTransitions(challenge.status).map(status => {
                  const option = statusOptions.find(opt => opt.value === status);
                  if (!option) return null;
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleStatusChange(challenge.id, option.value as ChallengeStatus)}
                      disabled={actionLoading === challenge.id}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Set to {option.label}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuItem
                  onClick={() => handleDelete(challenge.id)}
                  disabled={actionLoading === challenge.id}
                  className="text-error"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [actionLoading, statusOptions, handleStartNextWeek, handleStatusChange, handleDelete]
  );

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-error text-error px-4 py-3 rounded-md">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-blue">Challenge Management</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64 px-4 py-2 border border-gray-light-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all"
          />
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setSelectedStatus(option.value)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedStatus === option.value
                ? 'bg-primary-green text-white'
                : 'bg-gray-light text-text-primary hover:bg-gray-light-medium'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <SortableTable
          data={challenges}
          columns={columns}
          keyExtractor={(challenge) => challenge.id}
          headerClassName="bg-gray-very-light"
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10 rounded-lg">
            <Spinner size="lg" />
          </div>
        )}
      </div>

      {challenges.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">No challenges found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-text-secondary">
            {total > 0 ? (
              <>
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, total)} of {total} challenges
              </>
            ) : (
              'No challenges found'
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              className="px-3 py-2 border border-gray-light-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-light transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-2 bg-primary-green text-white rounded-full font-medium">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="px-3 py-2 border border-gray-light-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-light transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeManagement;

