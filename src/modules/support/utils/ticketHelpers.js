export const normalizeTicket = (ticket = {}) => ({
  id: ticket.id || '',
  title: ticket.title || '',
  customer: ticket.customer || ticket.user || '',
  category: ticket.category || 'technical',
  priority: ticket.priority || 'medium',
  status: ticket.status || 'open',
  assignedTo: ticket.assignedTo || '',
  createdAt: ticket.createdAt || '',
  updatedAt: ticket.updatedAt || ''
});

export const filterTickets = (tickets = [], filters = {}) => {
  const search = String(filters.search || '').trim().toLowerCase();
  const status = String(filters.status || '').trim().toLowerCase();
  const priority = String(filters.priority || '').trim().toLowerCase();
  const category = String(filters.category || '').trim().toLowerCase();

  return tickets.filter((ticket) => {
    const matchesSearch = !search || `${ticket.id} ${ticket.title} ${ticket.customer} ${ticket.assignedTo}`.toLowerCase().includes(search);
    const matchesStatus = !status || String(ticket.status || '').toLowerCase() === status;
    const matchesPriority = !priority || String(ticket.priority || '').toLowerCase() === priority;
    const matchesCategory = !category || String(ticket.category || '').toLowerCase() === category;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });
};
