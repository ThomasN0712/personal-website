'use client';

import { useState } from 'react';
import { Mail, Check, X, Loader2 } from 'lucide-react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DodgersSignupForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    if (selectedDays.length === 0) {
      setState('error');
      setMessage('Please select at least one day for notifications');
      setTimeout(() => {
        setState('idle');
        setMessage('');
      }, 3000);
      return;
    }

    setState('loading');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, preference_days: selectedDays }),
      });

      const data = await response.json();

      if (data.error) {
        setState('error');
        setMessage(data.error);
      } else {
        setState('success');
        setMessage(data.message);
        setEmail(''); // Clear email on success
        setSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']); // Reset to all days
      }
    } catch (error) {
      setState('error');
      setMessage('An unexpected error occurred. Please try again.');
    }

    // Reset state after 5 seconds
    setTimeout(() => {
      setState('idle');
      setMessage('');
    }, 5000);
  };

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'error':
        return <X className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getButtonStyles = () => {
    const base = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center min-w-[100px] whitespace-nowrap";
    
    switch (state) {
      case 'success':
        return `${base} bg-green-500 text-white`;
      case 'error':
        return `${base} bg-red-500 text-white`;
      case 'loading':
        return `${base} bg-primary/50 text-white cursor-not-allowed`;
      default:
        return `${base} bg-primary hover:bg-primary/90 text-white`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-lg font-bold text-dark-200 dark:text-stone-200">
          Try It Out!
        </h4>
        <p className="text-sm text-dark-200/70 dark:text-stone-200/70 leading-relaxed">
          Get Dodgers win notifications on your preferred days
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Day Preferences */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-200 dark:text-stone-200">
            Notification Days
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DAYS.map((day) => (
              <label key={day} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => handleDayToggle(day)}
                  className="w-4 h-4 text-primary bg-white dark:bg-dark-200 border-dark-200/30 dark:border-white/30 rounded focus:ring-primary focus:ring-2"
                  disabled={state === 'loading'}
                />
                <span className="text-sm text-dark-200 dark:text-stone-200">
                  {day.slice(0, 3)}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 bg-white dark:bg-dark-200 border border-dark-200/20 dark:border-white/20 rounded-lg text-dark-200 dark:text-stone-200 placeholder:text-dark-200/40 dark:placeholder:text-stone-200/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200"
            disabled={state === 'loading'}
            required
          />
          <button
            type="submit"
            disabled={state === 'loading' || !email.trim()}
            className={getButtonStyles()}
          >
            {getButtonContent()}
          </button>
        </div>
        
        {message && (
          <div className={`text-sm p-4 rounded-lg border transition-all duration-200 ${
            state === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {state === 'success' ? (
                <Check className="h-4 w-4 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          </div>
        )}

        {state === 'success' && (
          <div className="text-center pt-2">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              🎉 You're all set! Check your email for confirmation.
            </p>
          </div>
        )}
      </form>
      
      <p className="text-xs text-dark-200/50 dark:text-stone-200/50 text-center">
        No spam • Free to unsubscribe anytime
      </p>
    </div>
  );
}
