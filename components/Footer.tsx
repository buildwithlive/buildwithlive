import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-black py-12 border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
                    <div>
                        <p className="text-white font-bold text-xl mb-4">BUILD WITH VIDEOS</p>
                        <p className="text-gray-500 text-sm">The world's first live video bodybuilding book.</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <h4 className="text-white font-bold mb-2">Legal</h4>
                        <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">Terms & Conditions</Link>
                        <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                        <Link href="/refund-policy" className="text-gray-500 hover:text-white text-sm transition-colors">Refund Policy</Link>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-2">Contact</h4>
                        <p className="text-gray-500 text-sm">Email: buildwithlive@gmail.com</p>
                        <p className="text-gray-500 text-sm">Price: $20.00 (One-time)</p>
                    </div>
                </div>
                
                <div className="border-t border-white/10 pt-8 text-center">
                    <p className="text-gray-600 text-xs">© 2025 Build With Live. All rights reserved. Designed by Javi Isurumal.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;