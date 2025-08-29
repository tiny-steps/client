import React from 'react';

const Watermark = () => {
 return (
 <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
 <div
 className="absolute inset-0 top-30 flex items-center justify-center opacity-50"
 style={{
 objectFit: 'contain',
 backgroundImage: 'url(/logo.webp)',
 backgroundSize: '600px 660px',
 backgroundPosition: 'center',
 backgroundRepeat: 'no-repeat',
 transformOrigin: 'center center'
 }}
 />
 </div>
 );
};

export default Watermark;
