import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowDown, ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, Heart,
  Menu, Minus, Plus, Search, ShoppingBag, Truck, X,
} from 'lucide-react'
import { brandLogo, categories, formatPrice, heroImage, products, type Product } from './data'
import './App.css'

type CartLine = { productId: string; size: string; quantity: number }
type Checkout = { name: string; email: string; phone: string; deliveryDate: string; address: string; city: string; postcode: string }
const emptyCheckout: Checkout = { name: '', email: '', phone: '', deliveryDate: '', address: '', city: '', postcode: '' }

function App() {
  const [category, setCategory] = useState('all')
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('trioprl-cart') ?? '[]') as CartLine[]
    } catch {
      return []
    }
  })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkout, setCheckout] = useState(emptyCheckout)
  const [payment, setPayment] = useState('online')
  const [orderNumber, setOrderNumber] = useState('')
  const [toast, setToast] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const visibleProducts = useMemo(() => products.filter((product) => {
    const inCategory = category === 'all' || product.category === category
    const query = search.trim().toLowerCase()
    return inCategory && (!query || `${product.name} ${product.tone}`.toLowerCase().includes(query))
  }), [category, search])
  const cartItems = useMemo(() => cart.map((line) => ({ ...line, product: products.find((p) => p.id === line.productId)! })), [cart])
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = cartItems.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
  const delivery = subtotal === 0 || subtotal >= 250 ? 0 : 15
  const total = subtotal + delivery

  useEffect(() => {
    try {
      localStorage.setItem('trioprl-cart', JSON.stringify(cart))
    } catch {
      // Local storage is optional for the concept preview.
    }
  }, [cart])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = (message: string) => {
    setToast(message)
  }
  const addToCart = (product: Product, size = 'M', amount = 1) => {
    setCart((current) => {
      const found = current.find((line) => line.productId === product.id && line.size === size)
      if (found) return current.map((line) => line === found ? { ...line, quantity: line.quantity + amount } : line)
      return [...current, { productId: product.id, size, quantity: amount }]
    })
    setSelectedProduct(null); showToast(`${product.name} added to your bag`)
  }
  const updateLine = (productId: string, size: string, delta: number) => setCart((current) => current.flatMap((line) => {
    if (line.productId !== productId || line.size !== size) return [line]
    const next = line.quantity + delta
    return next > 0 ? [{ ...line, quantity: next }] : []
  }))
  const toggleFavorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const openProduct = (product: Product) => { setSelectedProduct(product); setSelectedSize('M'); setQuantity(1) }
  const startCheckout = () => { setCartOpen(false); setCheckoutOpen(true) }
  const closeCheckout = () => { setCheckoutOpen(false); setOrderNumber('') }
  const handleCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setOrderNumber(`CT-${Math.floor(100000 + Math.random() * 899999)}`); setCart([])
  }

  return (
    <div className="site-shell">
      <div className="announcement"><span>Complimentary delivery above RM250</span><span className="announcement-right">Designed for the considered everyday <ArrowRight size={14} /></span></div>
      <header className="site-header">
        <button className="icon-button menu-toggle" aria-label="Open menu" onClick={() => setMobileMenuOpen(true)}><Menu size={21} /></button>
        <a className="wordmark" href="#top" aria-label="trioPRL home"><span className="wordmark-logo"><img src={brandLogo} alt="trioPRL" /></span><span><strong>trioPRL</strong><small>CLASSIC GOODS</small></span></a>
        <nav className="main-nav" aria-label="Primary navigation"><a href="#shop">Shop</a><a href="#journal">Journal</a><a href="#about">About us</a></nav>
        <div className="header-actions"><button className="text-action delivery-link" onClick={() => document.getElementById('delivery')?.scrollIntoView({ behavior: 'smooth' })}>Delivery</button><button className="text-action" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search"><Search size={18} /></button><button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Open bag, ${itemCount} items`}><ShoppingBag size={18} /><span>Bag {itemCount > 0 && <b>{itemCount}</b>}</span></button></div>
      </header>
      {searchOpen && <div className="search-row"><Search size={17} /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the collection" /><button onClick={() => { setSearch(''); setSearchOpen(false) }} aria-label="Close search"><X size={18} /></button></div>}

      {mobileMenuOpen && <div className="mobile-menu-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileMenuOpen(false) }}><nav className="mobile-menu-panel" aria-label="Mobile navigation"><div className="mobile-menu-top"><a className="wordmark" href="#top" onClick={() => setMobileMenuOpen(false)}><span className="wordmark-logo"><img src={brandLogo} alt="trioPRL" /></span><span><strong>trioPRL</strong><small>CLASSIC GOODS</small></span></a><button className="icon-button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={20} /></button></div><a href="#shop" onClick={() => setMobileMenuOpen(false)}>Shop the collection <ArrowRight size={16} /></a><a href="#about" onClick={() => setMobileMenuOpen(false)}>Our point of view <ArrowRight size={16} /></a><a href="#delivery" onClick={() => setMobileMenuOpen(false)}>Delivery & returns <ArrowRight size={16} /></a><a href="mailto:hello@trioprl.my" onClick={() => setMobileMenuOpen(false)}>Say hello <ArrowRight size={16} /></a><div className="mobile-menu-note">Classic pieces, properly made in Malaysia.</div></nav></div>}

      <main id="top">
        <section className="hero-section"><div className="hero-visual"><div className="hero-image-wrap"><img src={heroImage} alt="Navy overshirt, ivory knit and charcoal trousers in a warm studio" decoding="async" /><div className="hero-shade" /></div><div className="hero-center"><span className="hero-logo-lockup"><img src={brandLogo} alt="trioPRL" /></span><p className="eyebrow">trioPRL · classic goods</p><h1>Made for<br /><em>everyday living.</em></h1><p className="hero-description">Timeless layers, considered fabrics and clothes that stay with you through every kind of day.</p><a className="light-button" href="#shop">Explore the collection <ArrowDown size={17} /></a></div><div className="hero-caption"><span>New season · The everyday edit</span><strong>01 / 06</strong></div></div></section>
        <section className="promise-strip"><div><span className="promise-number">01</span><div><strong>Considered materials</strong><p>Natural fibres. Honest finishes.</p></div></div><div><span className="promise-number">02</span><div><strong>Made to be worn</strong><p>Relaxed shapes for real life.</p></div></div><div><span className="promise-number">03</span><div><strong>Small-batch releases</strong><p>Less noise, better pieces.</p></div></div></section>
        <section id="shop" className="shop-section"><div className="section-heading"><div><p className="eyebrow">The collection</p><h2>Pieces with <em>purpose.</em></h2></div><p className="section-intro">A working wardrobe, edited for repeat wear. Every piece designed to settle into your week.</p></div><div className="shop-toolbar"><div className="category-tabs" role="tablist" aria-label="Filter pieces">{categories.map((item) => <button key={item.id} role="tab" aria-selected={category === item.id} className={category === item.id ? 'active' : ''} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div><span className="result-count">{visibleProducts.length} pieces <ChevronDown size={14} /></span></div><div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image" onClick={() => openProduct(product)}><img src={product.image} style={{ objectPosition: product.imagePosition }} alt={product.name} loading="lazy" decoding="async" />{product.label && <span className="product-label">{product.label}</span>}<button className={`favorite-button ${favorites.includes(product.id) ? 'is-favorite' : ''}`} onClick={(event) => { event.stopPropagation(); toggleFavorite(product.id) }} aria-label={favorites.includes(product.id) ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}><Heart size={17} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button><button className="quick-add" onClick={(event) => { event.stopPropagation(); addToCart(product) }}>Quick add <Plus size={15} /></button></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.tone}</p></div><strong>{formatPrice(product.price)}</strong></div></article>)}</div></section>
        <section id="about" className="studio-section"><div className="studio-image"><img src={products[2].image} alt="Grey quarter-zip cotton fleece" loading="lazy" decoding="async" /><span>Material study no. 04</span></div><div className="studio-copy"><p className="eyebrow">Our point of view</p><h2>Wear it in,<br /><em>wear it out.</em></h2><p>trioPRL is a study in enduring menswear: dependable staples, classic proportions and pieces that carry a little more character every time they are worn.</p><a className="underlined-link" href="#journal">Read our journal <ArrowRight size={16} /></a><div className="studio-signature">trio<br /><i>PRL</i></div></div></section>
        <section id="delivery" className="delivery-banner"><div><Truck size={24} /><div><p className="eyebrow">The easy part</p><h2>Take your time.<br /><em>We will take care of the rest.</em></h2></div></div><div className="delivery-details"><p>Free delivery above RM250. Easy returns within 14 days. Need a hand? <a href="mailto:hello@trioprl.my">hello@trioprl.my</a></p><span>Malaysia · Singapore · Worldwide</span></div></section>
      </main>
      <footer id="journal" className="site-footer"><div className="footer-brand"><span className="wordmark-logo footer-logo"><img src={brandLogo} alt="trioPRL" /></span><p>Classic pieces,<br />properly made.</p></div><div className="footer-links"><div><span>Explore</span><a href="#shop">Shop all</a><a href="#shop">New in</a><a href="#about">Our story</a></div><div><span>Help</span><a href="#delivery">Delivery & returns</a><a href="mailto:hello@trioprl.my">Contact</a><a href="#top">Size guide</a></div></div><div className="newsletter"><span>Notes from the edit</span><p>Occasional releases, new pieces and things worth keeping.</p><div className="newsletter-input"><input placeholder="Your email address" aria-label="Email address" /><button aria-label="Subscribe"><ArrowRight size={17} /></button></div></div><div className="footer-bottom"><span>© 2026 trioPRL</span><span>Made slowly in Malaysia</span><span>Instagram · Privacy</span></div></footer>

      {selectedProduct && <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}><div className="product-modal" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setSelectedProduct(null)} aria-label="Close product"><X size={19} /></button><div className="modal-product-image"><img src={selectedProduct.image} style={{ objectPosition: selectedProduct.imagePosition }} alt={selectedProduct.name} /></div><div className="modal-product-copy"><p className="eyebrow">{selectedProduct.tone}</p><h2>{selectedProduct.name}</h2><strong className="modal-price">{formatPrice(selectedProduct.price)}</strong><p>{selectedProduct.description}</p><div className="select-label"><span>Size</span><span>Fits true to size</span></div><div className="size-row">{selectedProduct.sizes.map((size) => <button key={size} className={selectedSize === size ? 'selected' : ''} onClick={() => setSelectedSize(size)}>{size}</button>)}</div><div className="modal-actions"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus size={15} /></button></div><button className="dark-button add-button" onClick={() => addToCart(selectedProduct, selectedSize, quantity)}>Add to bag <ArrowRight size={17} /></button></div><div className="modal-note"><Check size={15} /> Complimentary delivery over RM250</div></div></div></div>}
      {cartOpen && <div className="drawer-layer" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">Your selection</p><h2>Your bag <span>{itemCount}</span></h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X size={19} /></button></div>{itemCount > 0 && <div className="shipping-progress"><Truck size={16} /><span>{subtotal >= 250 ? 'You have unlocked complimentary delivery.' : `Add ${formatPrice(250 - subtotal)} for complimentary delivery.`}</span></div>}{itemCount === 0 ? <div className="empty-bag"><ShoppingBag size={32} /><p>Your bag is waiting.</p><button className="underlined-link" onClick={() => setCartOpen(false)}>Continue shopping <ArrowRight size={16} /></button></div> : <><div className="cart-lines">{cartItems.map(({ product, size, quantity: lineQuantity }) => <div className="cart-line" key={`${product.id}-${size}`}><img src={product.image} alt="" /><div className="cart-line-copy"><div><h3>{product.name}</h3><p>Size {size} · {formatPrice(product.price)}</p></div><div className="line-bottom"><div className="quantity small"><button onClick={() => updateLine(product.id, size, -1)} aria-label="Decrease item"><Minus size={13} /></button><span>{lineQuantity}</span><button onClick={() => updateLine(product.id, size, 1)} aria-label="Increase item"><Plus size={13} /></button></div><strong>{formatPrice(product.price * lineQuantity)}</strong></div></div><button className="remove-line" onClick={() => updateLine(product.id, size, -lineQuantity)} aria-label={`Remove ${product.name}`}><X size={15} /></button></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div><span>Delivery</span><strong>{delivery === 0 ? 'Complimentary' : formatPrice(delivery)}</strong></div><div className="total-row"><span>Total</span><strong>{formatPrice(total)}</strong></div><button className="dark-button checkout-button" onClick={startCheckout}>Continue to checkout <ArrowRight size={17} /></button><p className="secure-note"><Check size={14} /> Secure checkout · Demo payment only</p></div></>}</aside></div>}
      {checkoutOpen && <div className="modal-backdrop checkout-backdrop"><div className="checkout-modal"><button className="close-button" onClick={closeCheckout} aria-label="Close checkout"><X size={19} /></button>{orderNumber ? <div className="success-state"><div className="success-icon"><Check size={30} /></div><p className="eyebrow">Order received</p><h2>Thank you, {checkout.name.split(' ')[0] || 'there'}.</h2><p>Your order <strong>{orderNumber}</strong> is reserved in this concept demo. We will send delivery details to {checkout.email || 'your inbox'}.</p><button className="dark-button" onClick={closeCheckout}>Back to the collection <ArrowRight size={17} /></button></div> : <form onSubmit={handleCheckout}><button type="button" className="checkout-back" onClick={() => { setCheckoutOpen(false); setCartOpen(true) }}><ArrowLeft size={15} /> Back to bag</button><div className="checkout-heading"><p className="eyebrow">Almost yours</p><h2>Delivery & payment</h2><p>Tell us where to send your pieces.</p></div><div className="form-grid"><label>Full name<input required value={checkout.name} onChange={(event) => setCheckout({ ...checkout, name: event.target.value })} placeholder="Your name" /></label><label>Email address<input required type="email" value={checkout.email} onChange={(event) => setCheckout({ ...checkout, email: event.target.value })} placeholder="you@email.com" /></label><label>Phone number<input required value={checkout.phone} onChange={(event) => setCheckout({ ...checkout, phone: event.target.value })} placeholder="+60 12 345 6789" /></label><label>Preferred delivery date<input required type="date" value={checkout.deliveryDate} onChange={(event) => setCheckout({ ...checkout, deliveryDate: event.target.value })} /></label><label className="full-field">Address<input required value={checkout.address} onChange={(event) => setCheckout({ ...checkout, address: event.target.value })} placeholder="Street and unit number" /></label><label>City<input required value={checkout.city} onChange={(event) => setCheckout({ ...checkout, city: event.target.value })} placeholder="Bangi" /></label><label>Postcode<input required value={checkout.postcode} onChange={(event) => setCheckout({ ...checkout, postcode: event.target.value })} placeholder="43650" /></label></div><div className="payment-section"><div className="select-label"><span>Payment method</span><span>Total {formatPrice(total)}</span></div><div className="payment-options"><label className={payment === 'online' ? 'payment-selected' : ''}><input type="radio" name="payment" checked={payment === 'online'} onChange={() => setPayment('online')} /><span><strong>Online banking</strong><small>FPX · Maybank · CIMB</small></span><Check size={16} /></label><label className={payment === 'card' ? 'payment-selected' : ''}><input type="radio" name="payment" checked={payment === 'card'} onChange={() => setPayment('card')} /><span><strong>Card</strong><small>Visa · Mastercard · Amex</small></span><Check size={16} /></label></div>{payment === 'card' && <div className="card-fields"><label>Card number<input required placeholder="0000 0000 0000 0000" inputMode="numeric" /></label><div><label>Expiry<input required placeholder="MM / YY" /></label><label>Security code<input required placeholder="CVC" inputMode="numeric" /></label></div></div>}{payment === 'online' && <p className="payment-hint">You will choose your bank on the next step.</p>}</div><div className="demo-notice">Preview checkout. This is a concept demo; no payment will be processed.</div><button className="dark-button place-order" type="submit">Place demo order <ArrowRight size={17} /></button></form>}</div></div>}
      {toast && <div className="toast" role="status"><Check size={16} />{toast}</div>}
      <button className="mobile-bag-dock" onClick={() => setCartOpen(true)}><ShoppingBag size={17} /> Your bag <span>{itemCount} · {formatPrice(subtotal)}</span><ChevronRight size={16} /></button>
    </div>
  )
}

export default App
