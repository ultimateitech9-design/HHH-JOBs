import { useState } from 'react';
import { FiActivity, FiAlertTriangle, FiCheckCircle, FiUploadCloud } from 'react-icons/fi';
import { apiFetch } from '../../../utils/api';
import './PublicAtsPage.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const keywordPool = ['react', 'node', 'sql', 'api', 'javascript', 'typescript', 'docker', 'aws', 'git', 'communication'];

const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));

const localEstimate = (resumeText = '') => {
  const text = String(resumeText || '').toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const keywordMatches = keywordPool.filter((word) => text.includes(word));
  const missing = keywordPool.filter((word) => !keywordMatches.includes(word)).slice(0, 6);
  const metricsCount = (text.match(/\b\d+%?\b/g) || []).length;
  const hasSections = ['experience', 'skills', 'education', 'projects'].filter((x) => text.includes(x)).length;

  const keywordScore = clamp(30 + (keywordMatches.length / keywordPool.length) * 70);
  const formatScore = clamp(35 + (words.length > 180 ? 20 : 0) + (hasSections >= 3 ? 25 : hasSections * 7));
  const similarityScore = clamp(30 + Math.min(metricsCount, 10) * 6);
  const score = clamp((keywordScore * 0.45) + (formatScore * 0.25) + (similarityScore * 0.3));

  return {
    score,
    keywordScore,
    similarityScore,
    formatScore,
    matchedKeywords: keywordMatches,
    missingKeywords: missing,
    suggestions: [
      'Role-specific keywords ko experience bullets me naturally add karo.',
      'Har project/experience me measurable impact (%, count, time saved) add karo.',
      'Resume sections clean headings ke saath rakho: Summary, Skills, Experience, Projects.'
    ],
    warnings: words.length < 120 ? ['Resume text kaafi short hai, detail add karna useful rahega.'] : []
  };
};

const ScoreCard = ({ label, value }) => (
  <article className="public-ats-metric-card">
    <p>{label}</p>
    <strong>{Number(value || 0)}%</strong>
    <div className="public-ats-meter">
      <span style={{ width: `${Math.max(0, Math.min(100, Number(value) || 0))}%` }} />
    </div>
  </article>
);

const PublicAtsPage = () => {
  const [form, setForm] = useState({ resumeText: '', resumeUrl: '', fileName: '' });
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isRunning, setIsRunning] = useState(false);

  const runCheck = async (payload = form) => {
    if (!String(payload.resumeText || '').trim() && !String(payload.resumeUrl || '').trim()) {
      setMessage({ type: 'error', text: 'Pehle resume upload karo.' });
      return;
    }

    setIsRunning(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await apiFetch('/ats/check-preview', {
        method: 'POST',
        body: JSON.stringify({
          source: 'new_resume_upload',
          resumeText: payload.resumeText,
          resumeUrl: payload.resumeUrl,
          targetText: ''
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.result) throw new Error('Live ATS unavailable');
      setResult(data.result);
      setMessage({ type: 'success', text: 'ATS check complete.' });
    } catch (error) {
      setResult(localEstimate(payload.resumeText));
      setMessage({ type: 'info', text: 'Live ATS unavailable tha, local estimate show kiya gaya hai.' });
    } finally {
      setIsRunning(false);
    }
  };

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const fileName = String(file.name || '').toLowerCase();
    const fileType = String(file.type || '').toLowerCase();
    const isAllowed = (
      fileName.endsWith('.pdf')
      || fileName.endsWith('.doc')
      || fileName.endsWith('.docx')
      || fileName.endsWith('.txt')
      || fileType.includes('pdf')
      || fileType.includes('msword')
      || fileType.includes('officedocument.wordprocessingml')
      || fileType.includes('text/plain')
    );

    if (!isAllowed) {
      setMessage({ type: 'error', text: 'Sirf PDF, DOC, DOCX, TXT allowed hai.' });
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage({ type: 'error', text: 'File size 5MB se kam rakho.' });
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      if (typeof content !== 'string') {
        setMessage({ type: 'error', text: 'File read error.' });
        return;
      }

      const isTxt = fileType.includes('text/plain') || fileName.endsWith('.txt');
      const next = {
        resumeText: isTxt ? content : '',
        resumeUrl: isTxt ? '' : content,
        fileName: file.name
      };
      setForm(next);
      runCheck(next);
    };

    if (fileType.includes('text/plain') || fileName.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="public-ats-wrap">
      <section className="public-ats-hero">
        <div>
          <p className="public-ats-tag">Free ATS Check</p>
          <h1>Resume Upload karo, ATS Score turant pao</h1>
          <p className="public-ats-sub">Bina login koi bhi yahan se ATS check kar sakta hai.</p>
          <div className="public-ats-badges">
            <span>Instant analysis</span>
            <span>No signup needed</span>
            <span>Actionable suggestions</span>
          </div>
        </div>

        <div className="public-ats-upload">
          <label htmlFor="public-ats-file" className="public-ats-drop">
            <FiUploadCloud />
            <span>{form.fileName || 'Upload Resume (PDF, DOC, DOCX, TXT)'}</span>
          </label>
          <p className="public-ats-upload-note">Supported: PDF, DOC, DOCX, TXT · Max size: 5MB</p>
          <input
            id="public-ats-file"
            type="file"
            onChange={onFileChange}
            accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          />
          <button type="button" disabled={isRunning} onClick={() => runCheck()} className="public-ats-btn">
            <FiActivity />
            {isRunning ? 'Checking...' : 'Run ATS Check'}
          </button>
        </div>
      </section>

      {message.text ? <p className={`public-ats-message public-ats-message--${message.type || 'info'}`}>{message.text}</p> : null}

      {!result ? (
        <section className="public-ats-empty">
          <FiUploadCloud />
          <p>Resume upload karte hi ATS report yahan dikh jayegi.</p>
        </section>
      ) : null}

      {result ? (
        <section className="public-ats-result">
          <article className="public-ats-score">
            <strong>{Number(result.score || 0)}%</strong>
            <span>Overall ATS Score</span>
          </article>
          <ScoreCard label="Keyword" value={result.keywordScore} />
          <ScoreCard label="Similarity" value={result.similarityScore} />
          <ScoreCard label="Format" value={result.formatScore} />
        </section>
      ) : null}

      {result ? (
        <section className="public-ats-lists">
          <article>
            <h3><FiCheckCircle /> Suggestions</h3>
            <ul>
              {(result.suggestions || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article>
            <h3>Missing Keywords</h3>
            <div className="public-ats-chips">
              {(result.missingKeywords || []).length
                ? result.missingKeywords.map((k) => <span key={k}>{k}</span>)
                : <span>Great coverage</span>}
            </div>
            <h3 className="public-ats-secondary-heading">Matched Keywords</h3>
            <div className="public-ats-chips public-ats-chips--matched">
              {(result.matchedKeywords || []).length
                ? result.matchedKeywords.map((k) => <span key={k}>{k}</span>)
                : <span>Not enough data</span>}
            </div>
            {(result.warnings || []).length ? (
              <>
                <h3 className="public-ats-secondary-heading"><FiAlertTriangle /> Warnings</h3>
                <ul>
                  {result.warnings.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </>
            ) : null}
          </article>
        </section>
      ) : null}
    </div>
  );
};

export default PublicAtsPage;
