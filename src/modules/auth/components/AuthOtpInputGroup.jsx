const AuthOtpInputGroup = ({ values, inputRefs, onChange, onKeyDown, onPaste }) => {
  return (
    <div className="grid grid-cols-6 gap-3">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(event) => onChange(index, event.target.value)}
          onKeyDown={(event) => onKeyDown(index, event)}
          onPaste={onPaste}
          className="h-14 rounded-2xl border border-slate-200 bg-slate-50 text-center text-xl font-bold text-navy outline-none transition-all focus:border-brand-300 focus:bg-white"
        />
      ))}
    </div>
  );
};

export default AuthOtpInputGroup;
