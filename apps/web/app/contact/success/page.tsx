import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

export default function InquirySuccessPage() {
  return (
    <section className="state-page inquiry-success" aria-labelledby="inquiry-success-title">
      <p className="eyebrow">Studio dispatch // received</p>
      <div className="success-mark" aria-hidden="true"><Check size={28} strokeWidth={1.5} /></div>
      <h1 id="inquiry-success-title">Your brief is with us.</h1>
      <p>Thank you for sharing the details. The studio will review your inquiry and reply using the email address you provided.</p>
      <div className="success-rule"><span>Inquiry received</span><span>Response by email</span></div>
      <div className="button-row">
        <Link className="button-primary" href="/">Return home <ArrowUpRight aria-hidden="true" size={16} /></Link>
        <Link className="button-secondary" href="/contact">Send another brief</Link>
      </div>
    </section>
  );
}