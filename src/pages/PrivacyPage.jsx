import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {t('privacy.title') || 'Privacy Policy'}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {t('privacy.intro') || 'We respect your privacy and are committed to protecting your personal data.'}
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('privacy.dataCollection') || 'Data Collection'}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t('privacy.dataCollectionText') || 'We collect information you provide directly to us, such as when you create an account, make a reservation, or place an order.'}
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('privacy.dataUsage') || 'Data Usage'}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t('privacy.dataUsageText') || 'We use the information we collect to provide, maintain, and improve our services.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
