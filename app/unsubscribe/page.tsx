'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

type UnsubscribeState = 'loading' | 'success' | 'error' | 'already_unsubscribed';

export default function UnsubscribePage() {
  const [state, setState] = useState<UnsubscribeState>('loading');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setState('error');
      setMessage('Invalid unsubscribe link. No token provided.');
      return;
    }

    // Call the unsubscribe API
    fetch('/api/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        setState('error');
        setMessage(data.error);
      } else {
        if (data.message.includes('already unsubscribed')) {
          setState('already_unsubscribed');
        } else {
          setState('success');
          setEmail(data.email || '');
        }
        setMessage(data.message);
      }
    })
    .catch(error => {
      console.error('Unsubscribe error:', error);
      setState('error');
      setMessage('An unexpected error occurred. Please try again.');
    });
  }, [searchParams]);

  const renderIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="h-16 w-16 text-primary animate-spin" />;
      case 'success':
      case 'already_unsubscribed':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (state) {
      case 'loading':
        return 'Processing Unsubscribe Request...';
      case 'success':
        return 'Successfully Unsubscribed';
      case 'already_unsubscribed':
        return 'Already Unsubscribed';
      case 'error':
        return 'Unsubscribe Failed';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          {renderIcon()}
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-dark-200 dark:text-stone-200">
            {getTitle()}
          </h1>
          
          <p className="text-lg text-dark-200/70 dark:text-stone-200/70">
            {message}
          </p>
          
          {email && state === 'success' && (
            <p className="text-sm text-dark-200/60 dark:text-stone-200/60">
              {email} will no longer receive Dodgers win notifications.
            </p>
          )}
        </div>

        <div className="pt-6 space-y-4">
          {state === 'success' && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                You've been successfully removed from our mailing list. 
                You won't receive any more Dodgers win notifications.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              Back to Homepage
            </Link>
            
            {state === 'success' && (
              <a
                href="mailto:thomasnguyen0712@gmail.com?subject=Feedback%20about%20Dodgers%20notifications"
                className="inline-flex items-center justify-center px-6 py-3 border border-dark-200 dark:border-stone-200/20 text-base font-medium rounded-md text-dark-200 dark:text-stone-200 bg-transparent hover:bg-dark-100/5 dark:hover:bg-white/5 transition-colors duration-200"
              >
                Send Feedback
              </a>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-8 border-t border-dark-200/20 dark:border-stone-200/20">
          <p className="text-xs text-dark-200/50 dark:text-stone-200/50">
            This service sends notifications when the Los Angeles Dodgers win home games, 
            reminding you about Panda Express coupon availability.
          </p>
        </div>
      </div>
    </div>
  );
}
