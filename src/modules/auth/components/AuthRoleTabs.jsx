const AuthRoleTabs = ({
  label = 'Select role',
  helperText = 'Choose the role context before continuing.',
  value,
  options = [],
  onChange,
  disabled = false,
  compact = false,
  showDescriptions = true
}) => {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-2.5'}>
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {helperText ? <p className="mt-1 text-[11px] leading-5 text-slate-500">{helperText}</p> : null}
      </div>

      <div className="grid gap-2.5 md:grid-cols-3">
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              disabled={disabled}
              className={`rounded-[1.2rem] border px-3 ${compact ? 'py-2.5' : 'py-3'} text-left transition-all ${
                isActive
                  ? 'border-gold/30 bg-gold/10 text-navy shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-100 hover:bg-brand-50'
              } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`.trim()}
            >
              <p className="text-[13px] font-semibold leading-5">{option.label}</p>
              {showDescriptions && option.description ? (
                <p className="mt-1.5 text-[11px] leading-5 text-slate-500">{option.description}</p>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AuthRoleTabs;
