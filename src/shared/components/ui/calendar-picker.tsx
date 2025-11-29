import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CalendarPickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  placeholder?: string;
  className?: string;
}

export function CalendarPicker({ value, onChange, minDate, placeholder = 'Select date', className = '' }: CalendarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Initialize current month to show value's month if value exists
  useEffect(() => {
    if (value) {
      setCurrentMonth(new Date(value));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = selectedDate.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const min = new Date(minDate);
    return date < min;
  };

  const isDateSelected = (day: number) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div ref={calendarRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 left-0" style={{ display: 'block' }}>
          {/* Month Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', padding: '0.25rem' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
            {emptyDays.map(i => (
              <div key={`empty-${i}`} style={{ width: '36px', height: '36px' }} />
            ))}
            {days.map(day => {
              const disabled = isDateDisabled(day);
              const selected = isDateSelected(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => !disabled && handleDateSelect(day)}
                  disabled={disabled}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    borderRadius: '0.5rem',
                    backgroundColor: selected ? '#2563EB' : 'transparent',
                    color: disabled ? '#D1D5DB' : selected ? 'white' : '#111827',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    border: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled && !selected) {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!disabled && !selected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
