const normalizeStatus = (value, fallback) => String(value || fallback || '').toLowerCase();

export const mapSalesAgent = (agent = {}) => ({
  id: agent.id,
  name: agent.name || '-',
  email: agent.email || '-',
  dealsClosed: Number(agent.deals_closed || agent.dealsClosed || 0),
  revenue: Number(agent.revenue || 0),
  leadResponseRate: Number(agent.lead_response_rate || agent.leadResponseRate || 0),
  status: normalizeStatus(agent.status, 'active'),
  createdAt: agent.created_at || agent.createdAt || null
});

export const mapSalesProduct = (product = {}) => ({
  id: product.id,
  name: product.name || '-',
  category: product.category || 'Job Posting Plan',
  unitsSold: Number(product.units_sold || product.unitsSold || 0),
  revenue: Number(product.revenue || 0),
  status: product.is_active === false ? 'inactive' : normalizeStatus(product.status, 'active'),
  price: Number(product.price || 0),
  currency: product.currency || 'INR'
});

export const mapSalesOrder = (order = {}) => {
  const status = normalizeStatus(order.status, 'pending');
  return {
    id: order.id,
    orderNumber: order.order_number || order.orderNumber || order.id,
    customer: order.customer || order.customer_name || '-',
    product: order.product || order.plan || '-',
    amount: Number(order.amount || 0),
    quantity: Array.isArray(order.items) ? (order.items.length || 1) : Number(order.quantity || 1),
    paymentMethod: order.payment_method || order.paymentMethod || '-',
    salesAgent: order.salesAgent || '-',
    status,
    paymentStatus: status,
    createdAt: order.createdAt || order.created_at || null
  };
};

export const mapSalesLead = (lead = {}) => ({
  id: lead.id,
  company: lead.company || lead.company_name || '-',
  contactName: lead.contactName || lead.contact_name || '-',
  email: lead.email || lead.contact_email || '-',
  phone: lead.phone || lead.contact_phone || '-',
  source: lead.source || '-',
  assignedTo: lead.assignedTo || lead.assigned_name || '-',
  expectedValue: Number(lead.expectedValue ?? lead.value ?? 0),
  stage: normalizeStatus(lead.stage || lead.status, 'new'),
  createdAt: lead.createdAt || lead.created_at || null
});

export const mapSalesCustomer = (customer = {}) => ({
  id: customer.id,
  company: customer.company || customer.company_name || '-',
  contactName: customer.contactName || customer.contact_name || '-',
  email: customer.email || '-',
  phone: customer.phone || '-',
  plan: customer.plan || '-',
  lifetimeValue: Number(customer.lifetimeValue ?? customer.total_spent ?? 0),
  status: normalizeStatus(customer.status, 'active'),
  createdAt: customer.createdAt || customer.created_at || null
});

export const mapSalesCoupon = (coupon = {}) => {
  const expiresAt = coupon.expiresAt || coupon.valid_until || null;
  const isExpired = expiresAt ? new Date(expiresAt).getTime() < Date.now() : false;
  const isActive = coupon.is_active ?? coupon.status === 'active';
  return {
    id: coupon.id,
    code: coupon.code || '-',
    discountType: coupon.discountType || coupon.discount_type || '-',
    discountValue: coupon.discountType || coupon.discount_type
      ? `${coupon.discount_value ?? coupon.discountValue ?? 0}${(coupon.discountType || coupon.discount_type) === 'percent' ? '%' : ''}`
      : coupon.discountValue ?? coupon.discount_value ?? 0,
    usageCount: Number(coupon.usageCount ?? coupon.used_count ?? 0),
    status: isExpired ? 'expired' : (isActive ? 'active' : 'inactive'),
    expiresAt
  };
};

export const mapSalesRefund = (refund = {}) => ({
  id: refund.id,
  orderId: refund.orderId || refund.order_number || '-',
  customer: refund.customer || refund.customer_name || '-',
  amount: Number(refund.amount || 0),
  reason: refund.reason || 'Order refund',
  status: normalizeStatus(refund.status, 'refunded'),
  createdAt: refund.createdAt || refund.created_at || null
});
