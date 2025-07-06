import React from "react";

const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
            <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions – Cric11</h1>

            <p className="text-sm text-gray-600 mb-6 text-center">Effective Date: 1 July, 2025</p>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. Eligibility</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>You must be at least <strong>18 years old</strong> to use this platform.</li>
                    <li>Paid contests are only available in regions where such activities are legally permitted.</li>
                    <li>Cric11 is not responsible for users violating local laws.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. Account and Team Creation</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>Users must register to participate in contests.</li>
                    <li>Each team must include 11 players, including a <strong>Captain</strong> and <strong>Vice-Captain</strong>.</li>
                    <li>Captain earns <strong>2x</strong> points; Vice-Captain earns <strong>1.5x</strong> points.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. Contests and Scoring</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>Join contests before the match begins.</li>
                    <li>Points are based on <strong>real-time match data</strong> from external sources.</li>
                    <li>Cric11 is not liable for delays or inaccuracies in match data.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. Payments and Winnings</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>Payments are securely processed via <strong>Razorpay</strong>.</li>
                    <li>Entry fees are required for paid contests.</li>
                    <li>Winnings are auto-calculated and distributed after results.</li>
                    <li>Tied scores may result in equal splits of winnings.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. Withdrawals</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>Withdrawals require KYC verification (if applicable).</li>
                    <li>Processing time: <strong>2–5 business days</strong>.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">6. Fair Play and Conduct</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>No multiple accounts or bots allowed.</li>
                    <li>Any misuse or manipulation may lead to suspension or ban.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">7. Disclaimer</h2>
                <p>
                    Cric11 is an <strong>independent demo project</strong> and is not affiliated with the BCCI, IPL, or any official board.
                    All data and features are for educational and portfolio use only.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">8. Limitation of Liability</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>No responsibility for payment failures or server issues.</li>
                    <li>Use the app at your own risk. No guarantees provided.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">9. Modifications</h2>
                <p>
                    Cric11 reserves the right to modify these terms at any time. Continued use implies acceptance of changes.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">10. Contact</h2>
                <p>
                    For any queries or concerns, please contact us at <a href="mailto:ankitmittal0814@gmail.com" className="text-blue-600 underline">ankitmittal0814@gmail.com</a>.
                </p>
            </section>
        </div>
    );
};

export default Terms;
