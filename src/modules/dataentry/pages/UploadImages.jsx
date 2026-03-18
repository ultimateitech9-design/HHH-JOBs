import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import DataEntryImageUploader from '../components/DataEntryImageUploader';
import { getDataEntryEntryById, uploadEntryImages } from '../services/dataentryApi';

const UploadImages = () => {
  const [searchParams] = useSearchParams();
  const [entry, setEntry] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const entryId = searchParams.get('entryId') || '';

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const response = await getDataEntryEntryById(entryId);
      if (!mounted) return;
      setEntry(response.data || null);
      setError(response.error || '');
      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [entryId]);

  const handleUpload = async () => {
    if (!entry?.id || files.length === 0) return;

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const uploaded = await uploadEntryImages(entry.id, files);
      setMessage(`${uploaded.length || files.length} images uploaded for ${entry.id}.`);
      setFiles([]);
    } catch (actionError) {
      setError(actionError.message || 'Unable to upload images.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="module-page module-page--dataentry">
      <SectionHeader
        eyebrow="Data Entry"
        title="Upload Images"
        subtitle="Attach office, company, or listing images to the selected data entry record."
      />

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}
      {loading ? <p className="module-note">Loading entry context...</p> : null}

      {!loading ? (
        <DataEntryImageUploader
          entryId={entry?.id || ''}
          files={files}
          uploading={uploading}
          onChange={(event) => setFiles(Array.from(event.target.files || []))}
          onSubmit={handleUpload}
        />
      ) : null}
    </div>
  );
};

export default UploadImages;
