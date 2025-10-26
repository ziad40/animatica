import React, { useState, useRef, useEffect} from 'react';

// component props: onSelect (function), placeholder (string)
// Renders an input that only accepts digits (0-9)
// and add handlers to prevent non-digit input, sanitize pasted text, and keep older browsers consistent.
const NumberInput = ({ onSelect, placeholder, className, value: propValue, allowDecimal = true, decimalSeparator = '.' }) => {
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
        // allow decimal separator if configured and not already present (or selection will replace it)
        if (allowDecimal && (k === decimalSeparator || (decimalSeparator === '.' && k === 'Decimal'))) {
            const input = ref.current;
            if (!input) return false;
            const { selectionStart, selectionEnd } = input;
            const current = value || '';
            // if selection includes existing separator, allow
            const sel = String(current).slice(selectionStart || 0, selectionEnd || 0);
            if (sel.includes(decimalSeparator)) return true;
            // otherwise disallow if separator already present
            if (current.includes(decimalSeparator)) return false;
            return true;
        }
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
        if (!pasted) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        const input = ref.current;
        if (!input) return;
        const { selectionStart, selectionEnd } = input;
        const before = value.slice(0, selectionStart || 0);
        const after = value.slice(selectionEnd || 0);

        // sanitize pasted text: keep digits and optionally one decimal separator
        let cleaned = pasted.replace(new RegExp(`[^0-9${decimalSeparator.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}]`, 'g'), '');
        if (allowDecimal) {
            // keep only the first decimal separator occurrence
            const parts = cleaned.split(decimalSeparator);
            cleaned = parts.shift() + (parts.length ? decimalSeparator + parts.join('') : '');
        } else {
            // remove any decimal separators from cleaned when decimals not allowed
            cleaned = cleaned.replace(new RegExp(`\\${decimalSeparator}`, 'g'), '');
        }

        // build next value
        const next = before + cleaned + after;
        // sanitize next to ensure only one separator
        const sanitized = allowDecimal ? (() => {
            const parts = next.split(decimalSeparator);
            return parts.shift() + (parts.length ? decimalSeparator + parts.join('') : '');
        })() : next.replace(new RegExp(`\\${decimalSeparator}`, 'g'), '');

        setAndNotify(sanitized);

        // set cursor after the inserted text
        requestAnimationFrame(() => {
            const pos = (before + cleaned).length;
            input.setSelectionRange(pos, pos);
        });
    };

    // On change (typing from IME or other inputs), sanitize to digits only
    const handleChange = (e) => {
        const raw = e.target.value || '';
        let sanitized;
        if (allowDecimal) {
            // remove any characters except digits and the decimal separator
            const cleaned = raw.replace(new RegExp(`[^0-9\\${decimalSeparator}]`, 'g'), '');
            // keep only the first separator
            const parts = cleaned.split(decimalSeparator);
            sanitized = parts.shift() + (parts.length ? decimalSeparator + parts.join('') : '');
        } else {
            sanitized = raw.replace(/\D+/g, '');
        }
        if (sanitized !== value) {
            setAndNotify(sanitized);
        }
    };

    return (
        <input
            ref={ref}
            type="text"
            inputMode={allowDecimal ? "decimal" : "numeric"}
            pattern={allowDecimal ? "[0-9]*\\.?[0-9]*" : "[0-9]*"}
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