import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-slate-500 text-sm">
          © {year} <span className="text-blue-400 font-semibold">Ecatu Ronald</span>. All rights
          reserved.
        </div>
        <div className="text-slate-500 text-sm">
          Designed &amp; Built by{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
            Ecatu Ronald
          </a>
        </div>
        <div className="text-slate-500 text-sm">Tata Uganda Ltd</div>
      </div>
    </footer>
  );
};

export default Footer;
