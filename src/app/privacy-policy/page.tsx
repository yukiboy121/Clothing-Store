export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-36 pb-24 bg-[#060914] text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-wider mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-blue max-w-none space-y-6 text-white/70">
          <p>Last updated: August 2026</p>
          
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-10">1. Information We Collect</h2>
          <p>We collect personal information that you provide to us when registering at the Website, expressing an interest in obtaining information about us or our products and services, or otherwise when you contact us.</p>
          
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-10">2. How We Use Your Information</h2>
          <p>We use the information we collect or receive:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To facilitate account creation and logon process.</li>
            <li>To fulfill and manage your orders.</li>
            <li>To deliver and facilitate delivery of services to the user.</li>
            <li>To respond to user inquiries/offer support to users.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-10">3. Will Your Information Be Shared With Anyone?</h2>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

          <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-10">4. How Long Do We Keep Your Information?</h2>
          <p>We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.</p>
        </div>
      </div>
    </div>
  );
}
