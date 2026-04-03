import SectionHeader from '../../../shared/components/SectionHeader';

const SupportHeader = ({ eyebrow, title, subtitle, action }) => (
  <SectionHeader eyebrow={eyebrow || 'Support'} title={title} subtitle={subtitle} action={action} />
);

export default SupportHeader;
