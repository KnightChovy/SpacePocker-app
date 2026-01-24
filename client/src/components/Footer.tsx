const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <img src="/logomautrang.png" alt="Logo" className="h-6 w-8" />
              </div>
              <span className="text-xl font-bold text-[#0e0d1b]">
                SPACEPOCKER
              </span>
            </div>
            <p className="max-w-xs text-sm text-gray-500">
              The modern way to find and book flexible workspaces globally.
              Built for the new era of work.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 sm:gap-20">
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-[#0e0d1b]">Product</h4>
              <a className="text-sm text-gray-500 hover:text-primary" href="#">
                Features
              </a>
              <a className="text-sm text-gray-500 hover:text-primary" href="#">
                Pricing
              </a>
              <a className="text-sm text-gray-500 hover:text-primary" href="#">
                Trust & Safety
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-[#0e0d1b]">Company</h4>
              <a className="text-sm text-gray-500 hover:text-primary" href="#">
                About Us
              </a>
              <a className="text-sm text-gray-500 hover:text-primary" href="#">
                Careers
              </a>
              <a className="text-sm text-gray-500 hover:text-primary" href="#">
                Blog
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-[#0e0d1b]">Support</h4>
              <a className="text-sm text-gray-500 hover:text-primary" href="#">
                Help Center
              </a>
              <a className="text-sm text-gray-500 hover:text-primary" href="#">
                Contact
              </a>
              <a className="text-sm text-gray-500 hover:text-primary" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Spacepocker Inc. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a className="text-gray-400 hover:text-primary" href="#">
                <span className="text-xs font-bold">TW</span>
              </a>
              <a className="text-gray-400 hover:text-primary" href="#">
                <span className="text-xs font-bold">IG</span>
              </a>
              <a className="text-gray-400 hover:text-primary" href="#">
                <span className="text-xs font-bold">LI</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
