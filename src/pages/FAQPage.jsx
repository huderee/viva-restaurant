import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQPage = () => {
  const { t } = useLanguage();

  const faqs = [
    {
      question: t('faq.q1') || 'How do I make a reservation?',
      answer: t('faq.a1') || 'You can make a reservation through our website by clicking on the Reservation section and filling out the form.',
    },
    {
      question: t('faq.q2') || 'What are your opening hours?',
      answer: t('faq.a2') || 'We are open from 11:00 AM to 10:30 PM every day.',
    },
    {
      question: t('faq.q3') || 'Do you offer delivery?',
      answer: t('faq.a3') || 'Yes, we offer delivery through our online ordering system.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {t('faq.title') || 'Frequently Asked Questions'}
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {faq.question}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
