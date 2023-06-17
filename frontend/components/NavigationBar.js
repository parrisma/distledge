import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router'

const NavigationBar = (props) => {

  const currentRoute = useRouter().pathname;
  return (
    <nav className='nav'>
      <ul >
        <li >
          <Link href="/tabs/escrow" className={currentRoute === '/tabs/escrow' ? 'active' : ''}>Escrow</Link>
        </li>
        <li >
          <Link href="/tabs/accounts" className={currentRoute === '/tabs/accounts' ? 'active' : ''}>Accounts</Link>
        </li>
        <li >
          <Link href="/tabs/price" className={currentRoute === '/tabs/price' ? 'active' : ''}>Price</Link>
        </li>
        <li>
          <Link href="/tabs/sell" className={currentRoute === '/tabs/sell' ? 'active' : ''}>Sell</Link>
        </li>
        <li>
          <Link href="/tabs/purchase" className={currentRoute === '/tabs/purchase' ? 'active' : ''}>Purchase</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavigationBar;