import { useState } from 'react';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: 'Orders & Shipping',
            questions: [
                {
                    question: 'How do I track my order?',
                    answer: 'Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order by logging into your account and viewing your order history.'
                },
                {
                    question: 'What are the shipping costs?',
                    answer: 'We offer free standard shipping on all orders. Express shipping options are available at checkout for an additional fee based on your location and package weight.'
                },
                {
                    question: 'How long does delivery take?',
                    answer: 'Standard shipping typically takes 3-7 business days. Express shipping takes 1-2 business days. International orders may take 7-14 business days depending on the destination.'
                },
                {
                    question: 'Do you ship internationally?',
                    answer: 'Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by location. Additional customs fees may apply depending on your country.'
                }
            ]
        },
        {
            category: 'Returns & Refunds',
            questions: [
                {
                    question: 'What is your return policy?',
                    answer: 'We offer a 30-day return policy for most items. Products must be unused, in original packaging, and in the same condition you received them. Some items like personal care products may not be eligible for return.'
                },
                {
                    question: 'How do I initiate a return?',
                    answer: 'Log into your account, go to Order History, select the order you want to return, and click "Request Return". Follow the instructions to print your return label and ship the item back to us.'
                },
                {
                    question: 'When will I receive my refund?',
                    answer: 'Refunds are processed within 5-10 business days after we receive your returned item. The refund will be credited to your original payment method. Please note that it may take additional time for your bank to process the refund.'
                },
                {
                    question: 'Are return shipping costs refundable?',
                    answer: 'Return shipping costs are only refundable if the return is due to our error (wrong item, defective product, etc.). For other returns, customers are responsible for return shipping costs.'
                }
            ]
        },
        {
            category: 'Payment & Pricing',
            questions: [
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All payments are processed securely through our encrypted payment gateway.'
                },
                {
                    question: 'Is it safe to use my credit card on your site?',
                    answer: 'Yes, absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers.'
                },
                {
                    question: 'Do you offer price matching?',
                    answer: 'We strive to offer competitive prices. While we don\'t have a formal price matching policy, we regularly review our prices to ensure they remain competitive in the market.'
                },
                {
                    question: 'Can I use multiple discount codes?',
                    answer: 'Only one discount code can be applied per order. If you have multiple codes, the system will automatically apply the one that gives you the best discount.'
                }
            ]
        },
        {
            category: 'Account & Security',
            questions: [
                {
                    question: 'How do I create an account?',
                    answer: 'Click the "Sign Up" button in the top right corner, enter your email, create a password, and provide your name. You\'ll receive a confirmation email to verify your account.'
                },
                {
                    question: 'I forgot my password. What should I do?',
                    answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you instructions to reset your password. The reset link is valid for 24 hours.'
                },
                {
                    question: 'How do I update my account information?',
                    answer: 'Log into your account, go to Account Settings, and you can update your personal information, shipping addresses, and payment methods.'
                },
                {
                    question: 'Can I delete my account?',
                    answer: 'Yes, you can request account deletion by contacting our support team at support@shopease.com. Please note that this action is permanent and cannot be undone.'
                }
            ]
        },
        {
            category: 'Products',
            questions: [
                {
                    question: 'How do I know if an item is in stock?',
                    answer: 'Product availability is shown on each product page. If an item shows "In Stock", it\'s available for immediate purchase. Out of stock items will display "Out of Stock" and you can sign up for restock notifications.'
                },
                {
                    question: 'Are your product images accurate?',
                    answer: 'We strive to display accurate product images. However, colors may vary slightly due to monitor settings. Please refer to the product description for detailed specifications.'
                },
                {
                    question: 'Do you offer product warranties?',
                    answer: 'Many of our products come with manufacturer warranties. Warranty information is listed on individual product pages. For warranty claims, please contact us with your order number.'
                },
                {
                    question: 'Can I cancel or modify my order?',
                    answer: 'Orders can be cancelled or modified within 1 hour of placement. After that, the order enters processing and cannot be changed. Please contact support immediately if you need to make changes.'
                }
            ]
        },
        {
            category: 'Technical Support',
            questions: [
                {
                    question: 'The website isn\'t working properly. What should I do?',
                    answer: 'Try clearing your browser cache and cookies, or try a different browser. If the problem persists, please contact our support team with details about the issue and your browser/device information.'
                },
                {
                    question: 'I\'m not receiving your emails. Why?',
                    answer: 'Check your spam/junk folder. Add support@shopease.com to your contacts to ensure our emails reach your inbox. If you still don\'t receive emails, contact support to verify your email address.'
                },
                {
                    question: 'How do I contact customer support?',
                    answer: 'You can reach us via email at support@shopease.com or call 1-800-SHOPEASE. Our support team is available Monday-Friday, 9 AM - 6 PM EST. We typically respond to emails within 24 hours.'
                }
            ]
        }
    ];

    const toggleQuestion = (categoryIndex, questionIndex) => {
        const index = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="pb-20">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 px-4 rounded-3xl mb-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-primary-100 text-lg">Find answers to common questions about shopping with ShopEase</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                {faqs.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-primary-600">
                            {category.category}
                        </h2>
                        <div className="space-y-4">
                            {category.questions.map((faq, questionIndex) => {
                                const index = `${categoryIndex}-${questionIndex}`;
                                const isOpen = openIndex === index;

                                return (
                                    <div
                                        key={questionIndex}
                                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <button
                                            onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                                            className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="font-semibold text-gray-900 flex-1">{faq.question}</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className={`flex-shrink-0 text-primary-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                                    }`}
                                            >
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </button>
                                        {isOpen && (
                                            <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Contact Section */}
                <div className="mt-16 p-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Still have questions?</h2>
                    <p className="text-gray-600 text-center mb-6">
                        Can't find the answer you're looking for? Our customer support team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="mailto:support@shopease.com"
                            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            Email Support
                        </a>
                        <a
                            href="tel:1-800-SHOPEASE"
                            className="flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-medium hover:bg-gray-50 transition-colors border-2 border-primary-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            Call Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
