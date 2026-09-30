import { useEffect, useRef } from "react";

/*
 * Six single-character OTP boxes that behave like one field.
 *
 * Typing a digit moves to the next box, backspace on an empty box steps back
 * and clears, arrow keys move without editing, and pasting a whole code fills
 * every box. The parent owns the value as one string, so nothing has to
 * concatenate six separate fields at submit time.
 */
const BOX_CLASS =
  "h-11 w-11 rounded-lg border text-center text-lg outline-none transition " +
  "focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

function OtpInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  autoFocus = true,
  disabled = false,
  hasError = false,
  id = "otp",
}) {
  const inputs = useRef([]);
  const chars = Array.from({ length }, (_, i) => value[i] ?? "");

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus();
  }, [autoFocus]);

  const focusAt = (index) => {
    const el = inputs.current[index];
    if (!el) return;
    el.focus();
    el.select();
  };

  // Announce completion only once all boxes actually hold a digit.
  const emit = (joined) => {
    onChange(joined);
    if (onComplete && joined.length === length && /^\d+$/.test(joined)) {
      onComplete(joined);
    }
  };

  const handleChange = (index, raw) => {
    const typed = String(raw).replace(/\D/g, "");
    const next = [...chars];

    if (!typed) {
      next[index] = "";
      emit(next.join(""));
      return;
    }

    // Several digits in one event means a paste or an SMS autofill — unless
    // this box already held a digit, in which case the newest digit is simply
    // replacing the old one and must not spill into the next box.
    if (typed.length > 1) {
      if (chars[index]) {
        next[index] = typed[typed.length - 1];
        emit(next.join(""));
        if (index < length - 1) focusAt(index + 1);
        return;
      }
      typed
        .slice(0, length)
        .split("")
        .forEach((digit, offset) => {
          next[offset] = digit;
        });
      emit(next.join(""));
      focusAt(Math.min(typed.length, length - 1));
      return;
    }

    next[index] = typed;
    emit(next.join(""));
    if (index < length - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...chars];
      if (next[index]) {
        next[index] = "";
        emit(next.join(""));
      } else if (index > 0) {
        next[index - 1] = "";
        emit(next.join(""));
        focusAt(index - 1);
      }
      return;
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (event) => {
    const pasted = (event.clipboardData.getData("text") || "").replace(/\D/g, "");
    if (!pasted) return;
    event.preventDefault();
    const next = Array.from({ length }, () => "");
    pasted
      .slice(0, length)
      .split("")
      .forEach((digit, offset) => {
        next[offset] = digit;
      });
    emit(next.join(""));
    focusAt(Math.min(pasted.length, length - 1));
  };

  return (
    <div className="flex gap-2">
      {chars.map((char, index) => {
        const filled = char !== "";
        return (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            id={`${id}-${index}`}
            type="text"
            inputMode="numeric"
            // Lets iOS/Android offer the code from the SMS above the keyboard.
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={length}
            value={char}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(event) => event.target.select()}
            className={`${BOX_CLASS} ${
              hasError
                ? "border-red-300 focus:border-red-400 focus:ring-red-500/20"
                : filled
                  ? "border-violet-500 bg-violet-50/40"
                  : "border-gray-300 bg-white"
            }`}
          />
        );
      })}
    </div>
  );
}

export default OtpInput;
