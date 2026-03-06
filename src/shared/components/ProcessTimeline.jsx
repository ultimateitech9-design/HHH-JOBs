const ProcessTimeline = ({ steps }) => {
  return (
    <ol className="process-timeline">
      {steps.map((step, index) => (
        <li key={step.title}>
          <span className="timeline-index">{index + 1}</span>
          <div>
            <h4>{step.title}</h4>
            <p>{step.description}</p>
            {step.tags?.length ? (
              <div className="timeline-tags">
                {step.tags.map((tag) => (
                  <span key={tag} className="timeline-tag">{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ProcessTimeline;
