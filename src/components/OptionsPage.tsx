import React, { useState, useEffect } from 'react';
import { chromeStorage } from '../utils/storage';

interface WhitelistItem {
  url: string;
}

const OptionsPage: React.FC = () => {
  const [whitelist, setWhitelist] = useState<WhitelistItem[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadWhitelist = async () => {
      const result = await chromeStorage.get(['whitelist']);
      setWhitelist(result.whitelist || []);
    };
    loadWhitelist();
  }, []);

  const extractHostname = (url: string): string => {
    try {
      // Add protocol if not present to make URL parsing work
      const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

      const hostname = new URL(urlWithProtocol).hostname;
      // Remove 'www.' if present
      return hostname.replace(/^www\./, '');
    } catch {
      throw new Error('Invalid URL format');
    }
  };

  const handleAddUrl = async () => {
    if (!newUrl.trim()) return;

    try {
      setError('');
      const hostname = extractHostname(newUrl.trim());

      // Check if hostname already exists
      if (whitelist.some(item => item.url === hostname)) {
        setError('This website is already in the whitelist');
        return;
      }

      const updatedWhitelist = [...whitelist, { url: hostname }];
      await chromeStorage.set({ whitelist: updatedWhitelist });
      setWhitelist(updatedWhitelist);
      setNewUrl('');
    } catch (err) {
      setError('Please enter a valid website URL');
    }
  };

  const handleRemoveUrl = async (urlToRemove: string) => {
    const updatedWhitelist = whitelist.filter(item => item.url !== urlToRemove);
    await chromeStorage.set({ whitelist: updatedWhitelist });
    setWhitelist(updatedWhitelist);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8'>
      <div className='w-full max-w-3xl mx-auto px-4'>
        <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Pause Blocker</h1>
            <p className='text-gray-600'>Manage websites where auto-pause should be disabled</p>
          </div>

          {/* Add URL Form */}
          <div className='mb-8'>
            <div className='flex gap-3'>
              <div className='relative flex-1'>
                <input
                  type='text'
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
                  placeholder='Enter URL (e.g., instagram.com)'
                  className={`w-full px-4 py-3 rounded-lg border ${
                    error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                  } focus:border-transparent outline-none transition-all duration-200`}
                />
                {error && <p className='absolute -bottom-6 left-0 text-sm text-red-500'>{error}</p>}
              </div>
              <button
                onClick={handleAddUrl}
                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex-shrink-0 font-medium shadow-sm hover:shadow-md'
              >
                Add Website
              </button>
            </div>
          </div>

          {/* Whitelist */}
          <div className='space-y-3'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Whitelisted Websites</h2>
            {whitelist.length === 0 ? (
              <div className='text-center py-8 bg-gray-50 rounded-lg'>
                <p className='text-gray-500'>No websites added yet</p>
              </div>
            ) : (
              whitelist.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200'
                >
                  <div className='flex items-center'>
                    <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                      <span className='text-blue-600 font-medium'>{item.url.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className='text-gray-700 font-medium'>{item.url}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveUrl(item.url)}
                    className='text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors duration-200'
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsPage;
