import { useUsers } from '@/hooks/useUsers';
import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import SortableTable, { SortableColumn, SortDirection } from '@/components/SortableTable';
import { Spinner } from '@/components/ui/spinner';
import CreateAdminModal from '@/components/CreateAdminModal';
import { User } from '@/types';

const UserManagement: React.FC = () => {
  const {
    users,
    currentPage,
    pageSize,
    searchTerm,
    sortColumn,
    sortDesc,
    total,
    totalPages,
    isLoading,
    error,
    fetchUsers,
    createAdmin,
    deleteUser,
    setCurrentPage,
    setSearchTerm,
    setSort,
  } = useUsers();

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortColumn, sortDesc]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleSort = useCallback((columnKey: string, direction: SortDirection) => {
    if (direction === null) {
      setSort(null, false);
    } else {
      setSort(columnKey, direction === 'desc');
    }
  }, [setSort]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        await fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };


  const columns: SortableColumn<User>[] = useMemo(
    () => [
      {
        key: 'user',
        label: 'User',
        sortable: false,
        render: (_, user) => (
          <div className="flex items-center">
            {user.image ? (
              <img
                className="h-10 w-10 rounded-full"
                src={user.image}
                alt=""
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-green flex items-center justify-center text-white font-bold">
                {getInitials(user.first_name, user.last_name)}
              </div>
            )}
            <div className="ml-4">
              <div className="text-sm font-medium text-text-primary">
                {user.first_name} {user.last_name}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
      },
      {
        key: 'role',
        label: 'Role',
        sortable: true,
        render: (value) => (
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${value === 'admin'
                ? 'bg-red-100 text-error'
                : 'bg-bingo-mint text-bingo-forest'
              }`}
          >
            {value}
          </span>
        ),
      },
      {
        key: 'country',
        label: 'Country',
        sortable: true,
      },
      {
        key: 'display_name',
        label: 'Display Name',
        sortable: true,
      },
      {
        key: 'timezone',
        label: 'Timezone',
        sortable: true,
      },
      {
        key: 'activated',
        label: 'Activated',
        sortable: true,
        render: (value) => (
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              value
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {value ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        render: (_, user) => (
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-error hover:text-red-700 transition-colors"
          >
            Delete
          </button>
        ),
      },
    ],
    []
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
        <h1 className="text-3xl font-bold text-primary-blue">User Management</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-light-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all"
          />
          <CreateAdminModal
            onCreateAdmin={createAdmin as (userData: Partial<User> & { password: string }) => Promise<User>}
            onSuccess={fetchUsers}
          />
        </div>
      </div>

      <div className="relative">
        <SortableTable
          data={users}
          columns={columns}
          keyExtractor={(user) => user.id}
          headerClassName="bg-gray-very-light"
          sortColumn={sortColumn}
          sortDirection={sortDesc ? 'desc' : sortColumn ? 'asc' : null}
          onSort={handleSort}
        />

        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10 rounded-lg">
            <Spinner size="lg" />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-text-secondary">
          {total > 0 ? (
            <>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, total)} of {total} users
            </>
          ) : (
            'No users found'
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-light-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-light transition-colors"
          >
            Previous
          </button>
          <span className="px-3 py-2 bg-primary-green text-white rounded-full font-medium">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-light-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-light transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
