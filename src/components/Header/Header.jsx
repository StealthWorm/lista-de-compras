import { useEffect, useRef, useState } from 'react';
import { Link } from 'lucide-react';
import { quantityOfItems } from '../../lib/list.js';
import { showError, showSuccess } from '../../lib/notify.js';
import { ActiveShoppers } from '../ActiveShoppers/ActiveShoppers.jsx';
import { ListLink } from '../ListLink/ListLink.jsx';
import './Header.css';

export function Header({ count, people = [], canCopy = false, children }) {
  const [copied, setCopied] = useState(false);
  const [linkFallback, setLinkFallback] = useState('');
  const copiedTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  async function copyLink() {
    const link = window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      setLinkFallback('');
      setCopied(true);
      showSuccess('Link copiado');
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setLinkFallback(link);
      showError('Não consegui copiar. Segure o endereço e copie.');
    }
  }

  return (
    <>
      <header className="header">
        <div className="column header-row">
          <div>
            <h1>Lista de Compras</h1>

            <div className="header-row-info">
              {count == null ? null : (
                <p className="item-count">{quantityOfItems(count)}</p>
              )}
              {canCopy ? (
                <button type="button" className="copy-link" onClick={copyLink}>
                  <Link size={16} aria-hidden="true" />
                  {copied ? 'Copiado' : 'Copiar link'}
                </button>
              ) : null}
            </div>
          </div>
          <ActiveShoppers people={people} />
        </div>
      </header>
      <div className="sheet">
        <div className="column">
          <ListLink url={linkFallback} />
          {children}
        </div>
      </div>
    </>
  );
}
