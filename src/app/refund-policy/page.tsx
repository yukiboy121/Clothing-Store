export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen pt-36 pb-24 bg-void text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-wider mb-8">Refund & Returns Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-white/70">
          <p>We want you to be completely satisfied with your purchase. Read our policy below for details on returns and refunds.</p>
          
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-10">1. Eligibility for Returns</h2>
          <p>You have 14 days from the date of delivery to return an eligible item. To be eligible for a return, your item must be unused, unwashed, and in the same condition that you received it. It must also be in the original packaging with all tags attached.</p>
          
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-10">2. Non-Returnable Items</h2>
          <p>Custom-printed apparel, tailored items, and sale items are exempt from being returned unless there is a manufacturing defect.</p>

          <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-10">3. Refund Process</h2>
          <p>Once your return is received and inspected, we will send you an email to notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment within 7-14 business days.</p>

          <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-10">4. Shipping Costs</h2>
          <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
        </div>
      </div>
    </div>
  );
}
