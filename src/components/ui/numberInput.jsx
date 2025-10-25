import React, { useState, useRef, useEffect} from 'react';

// component props: onSelect (function), placeholder (string)
// Renders an input that only accepts digits (0-9)
// and add handlers to prevent non-digit input, sanitize pasted text, and keep older browsers consistent.
const NumberInput = ({ onSelect, placeholder, className, value: propValue }) => {
    const [value, setValue] = useState(propValue ?? "");
    const ref = useRef(null);

    const setAndNotify = (next) => {
        setValue(next);
        if (onSelect) onSelect(next);
    };

    // keep internal state in sync when parent provides a controlled value
    useEffect(() => {
        // treat null/undefined as empty string
        const normalized = propValue == null ? "" : String(propValue);
        if (normalized !== value) setValue(normalized);
    }, [propValue]);

    // Allow navigation/control keys and common shortcuts
    const isAllowedKey = (e) => {
        const k = e.key;
        // navigation & editing
        const allowed = [
            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab', 'Enter'
        ];
        if (allowed.includes(k)) return true;
        // Allow Ctrl/Cmd combos (copy/paste/cut/select all)
        if (e.ctrlKey || e.metaKey) return true;
        // allow single digit key (0-9)
        if (/^[0-9]$/.test(k)) return true;
        return false;
    };

    const handleKeyDown = (e) => {
        if (!isAllowedKey(e)) {
            e.preventDefault();
        }
    };

    // When user pastes, filter out non-digits and insert only digits at cursor
    const handlePaste = (e) => {
        const pasted = (e.clipboardData || window.clipboardData).getData('text') || '';
        const digits = pasted.replace(/\D+/g, '');
        if (!digits) {
            // nothing digit-like to paste
            e.preventDefault();
            return;
        }

        e.preventDefault();
        const input = ref.current;
        if (!input) return;
        const { selectionStart, selectionEnd } = input;
        const before = value.slice(0, selectionStart || 0);
        const after = value.slice(selectionEnd || 0);
        const next = before + digits + after;
        setAndNotify(next);

        // set cursor after the pasted digits
        // Delay required so DOM updates before adjusting selection
        requestAnimationFrame(() => {
            const pos = (before + digits).length;
            input.setSelectionRange(pos, pos);
        });
    };

    // On change (typing from IME or other inputs), sanitize to digits only
    const handleChange = (e) => {
        const raw = e.target.value || '';
        const sanitized = raw.replace(/\D+/g, '');
        if (sanitized !== value) {
            setAndNotify(sanitized);
        }
    };

    return (
        <input
            ref={ref}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onChange={handleChange}
            placeholder={placeholder || "Enter a number"}
            aria-label={placeholder || 'number input'}
            className={className || "border p-2 m-4"}
        />
    );
};

export default NumberInput;