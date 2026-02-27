// import React from 'react'

// const PageHeader = ({title, path}) => {
//   return (
//     <div className='py-24 mt-3 bg-[#FAFAFA] rounded flex items-center justify-center '>
//         <div>
//             <h2 className="text-3xl text-blue font-medium mb-1 text-center">{title}</h2>
//         <p className='text-sm text-center'><a href="/" className='font-bold'>Home</a> / {path}</p>
//         </div>
//     </div>
//   )
// }

// export default PageHeader

import React from 'react';

const PageHeader = ({ title, path }) => (
  <div className='pt-28 mb-6'>
    <div className='section-shell py-10 px-4 flex items-center justify-center text-center'>
      <div>
        <h2 className='text-3xl md:text-4xl hero-title font-bold mb-2'>{title}</h2>
        <p className='text-sm text-black/70'>
          <a href='/' className='font-bold'>Home</a>
          {' '}
          /
          {' '}
          {path}
        </p>
      </div>
    </div>
  </div>
);

export default PageHeader;
