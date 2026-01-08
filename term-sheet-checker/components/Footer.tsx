import Link from 'next/link';

interface FooterProps {
  showDisclaimer?: boolean;
}

export default function Footer({ showDisclaimer = true }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="border-t border-slate-800 pt-8">
          {showDisclaimer && (
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <p className="text-xs leading-relaxed">
                <strong className="text-white">DISCLAIMER:</strong> VentureCounsel.AI is an AI tool and is not a law firm. It does not provide legal advice, and its use does not create an attorney-client relationship. Use as a starting point for discussion with licensed counsel. For critical transactions, always consult a qualified attorney.
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs">&copy; 2025 VentureCounsel.AI. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-xs hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-xs hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
