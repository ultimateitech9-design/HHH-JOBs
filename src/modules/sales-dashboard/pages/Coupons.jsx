import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import CouponTable from '../components/CouponTable';
import SalesStatCards from '../components/SalesStatCards';
import { getCoupons } from '../services/couponApi';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getCoupons();
      setCoupons(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const cards = useMemo(() => [
    { label: 'Coupons', value: String(coupons.length), helper: 'Discount offers in catalog', tone: 'info' },
    { label: 'Active', value: String(coupons.filter((item) => item.status === 'active').length), helper: 'Available for checkout', tone: 'success' },
    { label: 'Expired', value: String(coupons.filter((item) => item.status === 'expired').length), helper: 'Inactive offer codes', tone: 'danger' },
    { label: 'Usage', value: String(coupons.reduce((sum, item) => sum + Number(item.usageCount || 0), 0)), helper: 'Visible redemption volume', tone: 'warning' }
  ], [coupons]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader eyebrow="Sales" title="Coupons" subtitle="Track promotional codes, discount behavior, active offers, and total coupon usage." />
      {error ? <p className="form-error">{error}</p> : null}
      <SalesStatCards cards={cards} />
      <section className="panel-card">
        {loading ? <p className="module-note">Loading coupons...</p> : null}
        <CouponTable rows={coupons} />
      </section>
    </div>
  );
};

export default Coupons;
