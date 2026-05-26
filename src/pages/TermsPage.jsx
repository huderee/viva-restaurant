import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TermsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {t('terms.title') || 'Terms of Service'}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {t('terms.intro') || 'By using our services, you agree to these terms.'}
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('terms.reservations') || 'Reservations'}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t('terms.reservationsText') || 'Reservations are subject to availability. We reserve the right to cancel or modify reservations.'}
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('terms.orders') || 'Orders'}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t('terms.ordersText') || 'All orders are subject to acceptance and availability.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
