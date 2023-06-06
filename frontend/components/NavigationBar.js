import Link from 'next/link';
import { useState } from 'react';

const NavigationBar = (props) =>{    

    return (
    <nav className='nav'>
      <ul >
        {/* <li >
            <Link href="/">Home</Link>
        </li>        
        <li >
          <Link href="/tabs/escrow">Escrow</Link>
        </li> */}
        <li >
          <Link href="/tabs/accounts">Acounts</Link>
        </li>
        <li >
          <Link href="/tabs/price">Price</Link>
        </li>
        <li>
          <Link href="/tabs/seller">Sell</Link>
        </li>
        <li>
          <Link href="/tabs/buyer">Purchase</Link>
        </li>        
      </ul>
    </nav>
    );
}

export default NavigationBar;