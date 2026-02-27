import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { usePage } from '@inertiajs/react';

export default function Toast() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        } else if (flash.message) {
            setMessage(flash.message);
            setType('info');
            setVisible(true);
        }

        if (flash.success || flash.error || flash.message) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible) return null;

    return (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-brand-600'
            } animate-fade-in-up`}>
            <div className="mr-3">
                {type === 'success' && <CheckCircle className="w-6 h-6" />}
                {type === 'error' && <AlertCircle className="w-6 h-6" />}
                {type === 'info' && <CheckCircle className="w-6 h-6" />}
            </div>
            <div className="text-sm font-medium mr-8">
                {message}
            </div>
            <button
                onClick={() => setVisible(false)}
                className="hover:text-gray-200 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}
