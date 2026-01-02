import { useNavigate } from 'react-router-dom'
import { ReactComponent as CartIcon } from '../../img/cart-icon.svg'
import { ReactComponent as SellIcon } from '../../img/sell-icon.svg'
import { ReactComponent as ExRightsIcon } from '../../img/ex-rights-icon.svg'
import { ReactComponent as ExDividendsIcon } from '../../img/ex-dividends-icon.svg'

const tabs = [
    { key: 'buy', text: '買進', path: '/buy', Icon: CartIcon },
    { key: 'sell', text: '賣出', path: '/transaction', Icon: SellIcon },
    { key: 'exRights', text: '除權', path: '/ex-rights', Icon: ExRightsIcon },
    { key: 'exDividends', text: '除息', path: '/ex-dividends', Icon: ExDividendsIcon }
]

export default function TransactionTabs({ active }) {
    const navigate = useNavigate()

    return (
        <div className="tab-section">
            {tabs.map(t => {
                const color = active === t.key ? '#DC7AF5' : '#6A758C'
                return (
                    <div key={t.key} className="tab-item" onClick={() => navigate(t.path)}>
                        <div className="tab-item-text">{t.text}</div>
                        <t.Icon className="tab-item-icon" style={{ color }} />
                        {t.key !== 'exDividends' && <div className="tab-item-side-decor-bar"></div>}
                    </div>
                )
            })}
        </div>
    )
}