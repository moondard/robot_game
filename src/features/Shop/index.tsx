import { useNavigate } from 'react-router-dom';

import type { IShopItem } from '../../interfaces/ShopItem';

import './styles.scss';

// Заглушка: список товаров до продумывания механики улучшений
const MOCK_ITEMS: IShopItem[] = [
    { id: '1', name: 'Название', description: 'Описание улучшения', price: 100 },
    { id: '2', name: 'Название', description: 'Описание улучшения', price: 150 },
    { id: '3', name: 'Название', description: 'Описание улучшения', price: 200 },
    { id: '4', name: 'Название', description: 'Описание улучшения', price: 250 },
];

/*
Экран магазина улучшений.
Пока статичный список товаров — без логики покупки.
*/
export function Shop() {
    const navigate = useNavigate();

    return (
        <div className="shop">
            <header className="shop__header">
                <button className="shop__back" onClick={() => navigate('/menu')}>
                    ← Назад
                </button>
                <h1 className="shop__title">Магазин</h1>
                <div className="shop__coins">🪙 0</div>
            </header>

            <div className="shop__grid">
                {MOCK_ITEMS.map((item) => (
                    <div key={item.id} className="shop__card">
                        <div className="shop__card-name">{item.name}</div>
                        <div className="shop__card-description">{item.description}</div>
                        <div className="shop__card-footer">
                            <span className="shop__card-price">🪙 {item.price}</span>
                            <button className="shop__card-buy">Купить</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}