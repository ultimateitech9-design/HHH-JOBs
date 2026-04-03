import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import ProductSalesTable from '../components/ProductSalesTable';
import SalesStatCards from '../components/SalesStatCards';
import { getProducts } from '../services/salesApi';
import { formatCompactCurrency } from '../utils/currencyFormat';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getProducts();
      setProducts(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const cards = useMemo(() => [
    { label: 'Products', value: String(products.length), helper: 'Sales catalog items', tone: 'info' },
    { label: 'Units Sold', value: String(products.reduce((sum, item) => sum + Number(item.unitsSold || 0), 0)), helper: 'Visible unit volume', tone: 'success' },
    { label: 'Revenue', value: formatCompactCurrency(products.reduce((sum, item) => sum + Number(item.revenue || 0), 0)), helper: 'Visible product revenue', tone: 'default' },
    { label: 'Active Products', value: String(products.filter((item) => item.status === 'active').length), helper: 'Current catalog coverage', tone: 'warning' }
  ], [products]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader eyebrow="Sales" title="Products" subtitle="Review which sales products, plans, and add-ons are generating the strongest revenue." />
      {error ? <p className="form-error">{error}</p> : null}
      <SalesStatCards cards={cards} />
      <section className="panel-card">
        {loading ? <p className="module-note">Loading products...</p> : null}
        <ProductSalesTable rows={products} />
      </section>
    </div>
  );
};

export default Products;
