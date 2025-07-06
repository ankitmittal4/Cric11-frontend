import React from "react";

const Privacy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
            <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy – Cric11</h1>

            <p className="text-sm text-gray-600 mb-6 text-center">Effective Date: 1 July, 2025</p>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                <p>
                    Cric11, We respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our fantasy cricket web application.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Personal Information:</strong> Name, email address, phone number, and date of birth (if applicable).</li>
                    <li><strong>Account Details:</strong> User credentials, wallet balance, and transaction history.</li>
                    <li><strong>Usage Data:</strong> Pages visited, actions taken (like team selection), and device information.</li>
                    <li><strong>Payment Information:</strong> Collected and processed via <strong>Razorpay</strong> in a secure and encrypted environment.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>To provide and operate the Cric11 platform.</li>
                    <li>To process contest entries and distribute winnings.</li>
                    <li>To personalize user experience and display contest statistics.</li>
                    <li>To improve security, detect fraud, and enforce platform rules.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. Sharing of Information</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>We <strong>do not sell</strong> your personal information to third parties.</li>
                    <li>Information may be shared with trusted third parties (e.g., payment processors) to operate Cric11 effectively.</li>
                    <li>We may disclose your data if required by law or to protect our rights and users.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
                <p>
                    We implement industry-standard measures to protect your information, including encryption, secure APIs, and access controls. However, no online platform is completely secure, and we cannot guarantee absolute security.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">6. Children's Privacy</h2>
                <p>
                    Cric11 is intended for users aged 18 and above. We do not knowingly collect data from children under 18. If we learn that we have inadvertently collected such data, it will be deleted promptly.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">7. User Control and Access</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>You may view and update your account information at any time from your profile settings.</li>
                    <li>You may request deletion of your data or account by contacting our support team.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated "Effective Date". Continued use of Cric11 constitutes your acceptance of the changes.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
                <p>
                    If you have any questions or concerns about this Privacy Policy, please contact us at:{" "}
                    <a href="mailto:ankitmittal0814@gmail.com" className="text-blue-600 underline">ankitmittal0814@gmail.com</a>
                </p>
            </section>
        </div>
    );
};

export default Privacy;
