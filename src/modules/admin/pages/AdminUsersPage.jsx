import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import StatusPill from '../../../shared/components/StatusPill';
import {
  formatDateTime,
  getAdminUsers,
  updateAdminHrApproval,
  updateAdminUserStatus
} from '../services/adminApi';

const initialFilters = {
  role: 'all',
  status: 'all',
  search: ''
};

const toApiFilters = (filters) => ({
  role: filters.role === 'all' ? '' : filters.role,
  status: filters.status === 'all' ? '' : filters.status,
  search: filters.search
});

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busyAction, setBusyAction] = useState('');

  const loadUsers = async (nextFilters = filters) => {
    setLoading(true);
    setError('');

    const response = await getAdminUsers(toApiFilters(nextFilters));
    setUsers(response.data || []);
    setError(response.error || '');
    setLoading(false);
  };

  useEffect(() => {
    loadUsers(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const hrUsers = users.filter((user) => String(user.role || '').toLowerCase() === 'hr');
    const pendingHr = hrUsers.filter((user) => !user.is_hr_approved).length;
    const blocked = users.filter((user) => String(user.status || '').toLowerCase() === 'blocked').length;
    const banned = users.filter((user) => String(user.status || '').toLowerCase() === 'banned').length;

    return [
      {
        label: 'Total Users',
        value: String(totalUsers),
        helper: `${hrUsers.length} HR accounts`,
        tone: 'info'
      },
      {
        label: 'HR Pending Approval',
        value: String(pendingHr),
        helper: 'Requires admin review',
        tone: pendingHr > 0 ? 'warning' : 'success'
      },
      {
        label: 'Blocked Users',
        value: String(blocked),
        helper: 'Temporary restriction',
        tone: blocked > 0 ? 'warning' : 'default'
      },
      {
        label: 'Banned Users',
        value: String(banned),
        helper: 'Permanently restricted',
        tone: banned > 0 ? 'danger' : 'default'
      }
    ];
  }, [users]);

  const applyLocalPatch = (userId, patch) => {
    setUsers((current) => current.map((user) => (user.id === userId ? { ...user, ...patch } : user)));
  };

  const handleStatusChange = async (userId, nextStatus) => {
    const user = users.find((entry) => entry.id === userId);
    if (!user || user.status === nextStatus) return;

    setBusyAction(`status:${userId}`);
    setError('');
    setMessage('');

    try {
      const updated = await updateAdminUserStatus(userId, nextStatus);
      applyLocalPatch(userId, updated);
      setMessage(`Updated ${user.name} to ${nextStatus}.`);
    } catch (actionError) {
      setError(String(actionError.message || 'Unable to update user status.'));
    } finally {
      setBusyAction('');
    }
  };

  const handleHrApproval = async (userId, approved) => {
    const user = users.find((entry) => entry.id === userId);
    if (!user) return;

    setBusyAction(`approval:${userId}`);
    setError('');
    setMessage('');

    try {
      const updated = await updateAdminHrApproval(userId, approved);
      applyLocalPatch(userId, updated);
      setMessage(`${user.name} ${approved ? 'approved' : 'set to pending'} for HR access.`);
    } catch (actionError) {
      setError(String(actionError.message || 'Unable to update HR approval.'));
    } finally {
      setBusyAction('');
    }
  };

  const rows = useMemo(() => {
    return users.map((user) => ({
      ...user,
      role: String(user.role || '-').toUpperCase()
    }));
  }, [users]);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill value={value || 'active'} />
    },
    {
      key: 'is_hr_approved',
      label: 'HR Approval',
      render: (value, row) => (String(row.role || '').toLowerCase() === 'hr' ? <StatusPill value={value ? 'approved' : 'pending'} /> : '-')
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value) => formatDateTime(value)
    },
    {
      key: 'last_login_at',
      label: 'Last Login',
      render: (value) => formatDateTime(value)
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => {
        const rowId = row.id;
        const isStatusBusy = busyAction === `status:${rowId}`;
        const isApprovalBusy = busyAction === `approval:${rowId}`;
        const role = String(row.role || '').toLowerCase();

        return (
          <div className="student-job-actions">
            <button type="button" className="btn-link" disabled={isStatusBusy} onClick={() => handleStatusChange(rowId, 'active')}>Active</button>
            <button type="button" className="btn-link" disabled={isStatusBusy} onClick={() => handleStatusChange(rowId, 'blocked')}>Block</button>
            <button type="button" className="btn-link" disabled={isStatusBusy} onClick={() => handleStatusChange(rowId, 'banned')}>Ban</button>
            {role === 'hr' ? (
              <button
                type="button"
                className="btn-link"
                disabled={isApprovalBusy}
                onClick={() => handleHrApproval(rowId, !row.is_hr_approved)}
              >
                {row.is_hr_approved ? 'Revoke HR' : 'Approve HR'}
              </button>
            ) : null}
          </div>
        );
      }
    }
  ];

  return (
    <div className="module-page module-page--admin">
      <SectionHeader
        eyebrow="Users & HR"
        title="User Status and HR Approval"
        subtitle="Approve recruiters, control account status, and keep user access policy aligned."
      />

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <div className="stats-grid">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <section className="panel-card">
        <div className="student-inline-controls">
          <label>
            Role
            <select value={filters.role} onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}>
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="student">Student</option>
            </select>
          </label>

          <label>
            Status
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="banned">Banned</option>
            </select>
          </label>

          <label className="full-width-control">
            Search
            <input
              value={filters.search}
              placeholder="Name or email"
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </label>

          <div className="student-job-actions">
            <button type="button" className="btn-primary" onClick={() => loadUsers(filters)}>Apply</button>
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setFilters(initialFilters);
                loadUsers(initialFilters);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? <p className="module-note">Loading users...</p> : null}
        <DataTable columns={columns} rows={rows} />
      </section>
    </div>
  );
};

export default AdminUsersPage;
