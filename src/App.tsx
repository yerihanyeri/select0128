import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingBag,
  X,
  Play,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
} from "lucide-react";
import "./App.css";

// --- Types ---
interface Product {
  id: number;
  category: "top" | "bottom" | "acc";
  name: string;
  price: number;
  img: string;
  desc: string;
}

interface CartItem {
  id: number;
  qty: number;
}

// --- Data ---
const PRODUCTS: Product[] = [
  {
    id: 101,
    category: "top",
    name: "Minimal Cotton Shirt",
    price: 45000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20251105/5689284/5689284_17623251007826_big.jpg?w=1200",
    desc: "구김이 적고 탄탄한 고밀도 코튼 소재로 제작된 베이직 셔츠.",
  },
  {
    id: 102,
    category: "top",
    name: "Structure Blazer",
    price: 128000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20240829/4381812/4381812_17248606884034_big.jpg?w=1200",
    desc: "세련된 실루엣이 돋보이는 블레이저.",
  },
  {
    id: 103,
    category: "top",
    name: "Cashmere Knit",
    price: 89000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20220816/2718818/2718818_17313785842192_big.jpg?w=1200",
    desc: "부드러운 터치감의 캐시미어 니트.",
  },
  {
    id: 104,
    category: "top",
    name: "Oxford Stripe",
    price: 49000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20210204/1778306/1778306_16776495147879_big.jpg?w=1200",
    desc: "경쾌한 스트라이프 패턴 옥스포드 셔츠.",
  },
  {
    id: 105,
    category: "top",
    name: "Daily Hoodie",
    price: 68000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20230906/3534898/3534898_16945866380614_big.jpg?w=1200",
    desc: "편안하게 착용 가능한 데일리 후드.",
  },

  {
    id: 201,
    category: "bottom",
    name: "Wide Slacks",
    price: 58000,
    img: "https://image.msscdn.net/thumbnails/images/prd_img/20230201/3054149/detail_3054149_17243884524921_big.jpg?w=1200",
    desc: "트렌디한 핏의 와이드 슬랙스.",
  },
  {
    id: 202,
    category: "bottom",
    name: "Straight Denim",
    price: 72000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20230222/3098327/3098327_16770483840742_big.jpg?w=1200",
    desc: "자연스러운 워싱의 스트레이트 데님.",
  },
  {
    id: 203,
    category: "bottom",
    name: "Chino Pants",
    price: 54000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20210825/2085731/2085731_2_big.jpg?w=1200",
    desc: "클래식한 무드의 치노 팬츠.",
  },
  {
    id: 204,
    category: "bottom",
    name: "Sweat Jogger",
    price: 42000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20200917/1610425/1610425_1_big.jpg?w=1200",
    desc: "활동성이 좋은 조거 팬츠.",
  },
  {
    id: 205,
    category: "bottom",
    name: "Shorts Navy",
    price: 39000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20220317/2425406/2425406_1_big.jpg?w=1200",
    desc: "시원한 네이비 컬러 쇼츠.",
  },

  {
    id: 301,
    category: "acc",
    name: "Derby Shoes",
    price: 110000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20231215/3757717/3757717_17043450718700_big.jpg?w=1200",
    desc: "깔끔한 디자인의 더비 슈즈.",
  },
  {
    id: 302,
    category: "acc",
    name: "German Trainers",
    price: 98000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20210201/1771141/1771141_1_big.jpg?w=1200",
    desc: "빈티지한 감성의 독일군 스니커즈.",
  },
  {
    id: 303,
    category: "acc",
    name: "Canvas Bag",
    price: 32000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20260114/5894493/5894493_17684611859962_big.jpg?w=1200",
    desc: "수납공간이 넉넉한 캔버스 백.",
  },
  {
    id: 304,
    category: "acc",
    name: "Leather Belt",
    price: 28000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20190522/1051512/1051512_1_big.jpg?w=1200",
    desc: "천연 소가죽 베이직 벨트.",
  },
  {
    id: 305,
    category: "acc",
    name: "Ball Cap",
    price: 35000,
    img: "https://image.msscdn.net/thumbnails/images/goods_img/20200827/1567175/1567175_2_big.jpg?w=1200",
    desc: "어디에나 어울리는 로고 볼캡.",
  },
];

const MIN_PRICE = Math.min(...PRODUCTS.map((p) => p.price));

function App() {
  // --- States ---
  const [budget, setBudget] = useState<number>(MIN_PRICE);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [flexMode, setFlexMode] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [budgetOverride, setBudgetOverride] = useState<boolean>(false);

  // Refs
  const budgetRef = useRef<HTMLElement>(null);

  // Modal States
  const [alertInfo, setAlertInfo] = useState<{
    isOpen: boolean;
    msg: React.ReactNode;
    pendingAction?: () => void;
  }>({ isOpen: false, msg: "" });
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailQty, setDetailQty] = useState<number>(1);
  const [showVideo, setShowVideo] = useState<boolean>(false);

  // --- Derived State ---
  const totalSpent = cart.reduce((sum, item) => {
    const p = PRODUCTS.find((prod) => prod.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  const remaining = budget - totalSpent;
  const progressPercent = Math.min(100, (totalSpent / budget) * 100);

  // --- Logic Helpers ---
  const checkBudget = (costToAdd: number): boolean => {
    if (flexMode || budgetOverride) return true;
    if (totalSpent + costToAdd > budget) {
      return false;
    }
    return true;
  };

  const handleAddToCart = (id: number, qtyToAdd: number) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    if (!checkBudget(product.price * qtyToAdd)) {
      setAlertInfo({
        isOpen: true,
        msg: (
          <>
            예산을{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>
              {(
                totalSpent +
                product.price * qtyToAdd -
                budget
              ).toLocaleString()}
              원
            </span>{" "}
            초과했습니다.
            <br />
            어떻게 하시겠습니까?
          </>
        ),
        pendingAction: () => confirmAddToCart(id, qtyToAdd),
      });
      return;
    }
    confirmAddToCart(id, qtyToAdd);
  };

  const confirmAddToCart = (id: number, qtyToAdd: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + qtyToAdd } : item,
        );
      }
      return [...prev, { id, qty: qtyToAdd }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQty = (id: number, change: number) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    const currentItem = cart.find((i) => i.id === id);
    if (!currentItem) return;

    const newQty = currentItem.qty + change;
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }

    if (change > 0 && !checkBudget(product.price)) {
      setAlertInfo({
        isOpen: true,
        msg: (
          <>
            예산 초과! (
            <span style={{ color: "red" }}>
              {(totalSpent + product.price - budget).toLocaleString()}원
            </span>
            )
          </>
        ),
        pendingAction: () => {
          setCart((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, qty: newQty } : item,
            ),
          );
        },
      });
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item)),
    );
  };

  const confirmAlert = () => {
    setBudgetOverride(true);
    if (alertInfo.pendingAction) alertInfo.pendingAction();
    setAlertInfo({ isOpen: false, msg: "" });
  };

  const handleGoToBudget = () => {
    setAlertInfo({ isOpen: false, msg: "" });
    if (budgetRef.current) {
      budgetRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleOpenDetail = (p: Product) => {
    setDetailProduct(p);
    setDetailQty(1);
    setShowVideo(false);
  };

  return (
    <div className="App">
      {/* Header */}
      <header>
        <div className="logo" onClick={() => window.scrollTo(0, 0)}>
          SELECT.
        </div>
        <div className="h-right">
          <button className="nav-link" onClick={() => alert("로그인 페이지")}>
            로그인
          </button>
          <button className="nav-link" onClick={() => alert("회원가입 페이지")}>
            회원가입
          </button>
          <div
            className="cart-icon-wrapper"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={24} />
            <span className="badge">{cart.length}</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <video autoPlay muted loop playsInline className="hero-video">
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-wearing-a-sequin-dress-39655-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-text">
          <h1>Less choice, better taste</h1>
          <p>편하고 후회없는 쇼핑</p>
        </div>
      </section>

      {/* Control Panel */}
      <section className="sticky-control" ref={budgetRef}>
        <div className="control-inner">
          {/* [수정] Budget Group: 슬라이더를 여기로 이동하여 '조작' 기능 통합 */}
          <div className="budget-group">
            <div className="label">SHOPPING BUDGET</div>
            <div className="budget-top-row">
              <button
                className="adj-btn"
                onClick={() =>
                  !flexMode && setBudget(Math.max(MIN_PRICE, budget - 10000))
                }
              >
                -
              </button>
              <div className="input-display">
                <span>₩</span>
                <input
                  type="number"
                  value={budget}
                  disabled={flexMode}
                  onChange={(e) =>
                    setBudget(
                      Math.max(MIN_PRICE, parseInt(e.target.value) || 0),
                    )
                  }
                />
              </div>
              <button
                className="adj-btn"
                onClick={() => !flexMode && setBudget(budget + 10000)}
              >
                +
              </button>
            </div>

            {/* 슬라이더가 이제 여기 위치합니다 */}
            <input
              type="range"
              className="slider"
              min={0}
              max={1000000}
              step={10000}
              value={budget}
              disabled={flexMode}
              onChange={(e) =>
                setBudget(Math.max(MIN_PRICE, parseInt(e.target.value)))
              }
            />
            <div className="min-msg">
              *최소 {MIN_PRICE.toLocaleString()}원 이상
            </div>
          </div>

          {/* Gauge Group: 순수 '현황판' 역할만 수행 */}
          <div className="gauge-group">
            <div className="status-text">
              <span>{flexMode ? "현재 지출" : "남은 예산"}</span>
              <span
                style={{ color: !flexMode && remaining < 0 ? "red" : "black" }}
              >
                {flexMode
                  ? `₩${totalSpent.toLocaleString()}`
                  : remaining < 0
                    ? "초과"
                    : `₩${remaining.toLocaleString()}`}
              </span>
            </div>
            <div className="track">
              <div
                className="fill"
                style={{
                  width: flexMode ? "100%" : `${progressPercent}%`,
                  background: !flexMode && remaining < 0 ? "red" : "black",
                }}
              ></div>
            </div>
          </div>

          {/* Flex Toggle */}
          <div className="flex-group">
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: flexMode ? "black" : "#888",
              }}
            >
              {flexMode ? "FLEX ON 🔥" : "FLEX OFF"}
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={flexMode}
                onChange={(e) => setFlexMode(e.target.checked)}
              />
              <span className="slider-toggle round"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Matcher */}
      <section className="matcher-section">
        <div className="guide-text">
          카드를 클릭하면 중앙으로 이동합니다.
          <br />
          중앙의 카드를 한번 더 누르면 상세 정보가 뜹니다.
        </div>
        <div className="center-line"></div>

        <MatchRow
          title="TOP"
          items={PRODUCTS.filter((p) => p.category === "top")}
          cart={cart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onOpenDetail={handleOpenDetail}
        />
        <MatchRow
          title="BOTTOM"
          items={PRODUCTS.filter((p) => p.category === "bottom")}
          cart={cart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onOpenDetail={handleOpenDetail}
        />
        <MatchRow
          title="SHOES"
          items={PRODUCTS.filter((p) => p.category === "acc")}
          cart={cart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onOpenDetail={handleOpenDetail}
        />
      </section>

      <footer
        style={{
          padding: "60px",
          textAlign: "center",
          color: "#888",
          fontSize: "12px",
          background: "#111",
        }}
      >
        <h3>SELECT.</h3>
        <p>&copy; 2026 Select Corp. All rights reserved.</p>
      </footer>

      {/* Cart Drawer */}
      <div
        className={`overlay ${isCartOpen ? "show" : ""}`}
        style={{ display: isCartOpen ? "block" : "none" }}
        onClick={() => setIsCartOpen(false)}
      ></div>
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3>SHOPPING BAG</h3>
          <button onClick={() => setIsCartOpen(false)}>
            <X />
          </button>
        </div>
        <div className="cart-list">
          {cart.length === 0 ? (
            <div
              style={{ textAlign: "center", marginTop: "50px", color: "#888" }}
            >
              비어있음
            </div>
          ) : (
            cart.map((item) => {
              const p = PRODUCTS.find((prod) => prod.id === item.id);
              if (!p) return null;
              return (
                <div key={item.id} className="cart-item">
                  <img src={p.img} alt={p.name} />
                  <div className="cart-info">
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ color: "#666" }}>
                      ₩{p.price.toLocaleString()}
                    </div>
                    <div className="cart-ctrl">
                      <button
                        className="c-btn"
                        onClick={() => handleUpdateQty(item.id, -1)}
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        className="c-btn"
                        onClick={() => handleUpdateQty(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="cart-footer">
          <div className="total-row">
            <span>TOTAL</span>
            <span>₩{totalSpent.toLocaleString()}</span>
          </div>
          <button
            className="checkout"
            onClick={() => alert("결제 페이지로 이동")}
          >
            CHECKOUT
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {detailProduct && (
        <div className="overlay" onClick={() => setDetailProduct(null)}>
          <div
            className="modal-detail-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setDetailProduct(null)}
            >
              <X />
            </button>
            <div
              className="detail-layout"
              style={{ display: "flex", width: "100%", height: "100%" }}
            >
              <div className="detail-left">
                <img
                  src={detailProduct.img}
                  alt={detailProduct.name}
                  className="detail-img"
                />
                <div className={`video-overlay ${showVideo ? "active" : ""}`}>
                  <button
                    className="close-video"
                    onClick={() => setShowVideo(false)}
                  >
                    <XCircle size={16} /> 이미지 보기
                  </button>
                  <video
                    src="https://assets.mixkit.co/videos/preview/mixkit-legs-of-a-man-walking-in-black-pants-2639-large.mp4"
                    autoPlay={showVideo}
                    loop
                    muted
                    playsInline
                    className="detail-video"
                  />
                </div>
              </div>
              <div className="detail-right">
                <div className="d-top">
                  <h2 className="d-name">{detailProduct.name}</h2>
                  <p className="d-cat">
                    {detailProduct.category.toUpperCase()}
                  </p>
                  <div className="d-price">
                    ₩{detailProduct.price.toLocaleString()}
                  </div>
                </div>
                <div className="d-mid">
                  <p className="d-desc">{detailProduct.desc}</p>
                  <button
                    className="video-btn"
                    onClick={() => setShowVideo(true)}
                  >
                    <Play size={14} /> AI 피팅 영상 보기
                  </button>
                </div>
                <div className="d-bot">
                  <div className="qty-select">
                    <button
                      onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                    >
                      -
                    </button>
                    <span>{detailQty}</span>
                    <button onClick={() => setDetailQty(detailQty + 1)}>
                      +
                    </button>
                  </div>
                  <button
                    className="add-btn"
                    onClick={() => {
                      handleAddToCart(detailProduct.id, detailQty);
                      setDetailProduct(null);
                    }}
                  >
                    {cart.find((i) => i.id === detailProduct.id)
                      ? "추가 담기"
                      : "장바구니 담기"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertInfo.isOpen && (
        <div className="overlay">
          <div className="modal-box">
            <h3>NOTICE</h3>
            <p>{alertInfo.msg}</p>
            <div className="modal-btn-group">
              <button className="adj-btn sub-btn" onClick={confirmAlert}>
                계속 쇼핑
              </button>
              <button className="adj-btn sub-btn" onClick={handleGoToBudget}>
                예산 재설정
              </button>
              <button
                className="adj-btn main-btn"
                onClick={() => setIsCartOpen(true)}
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub Component: MatchRow
const MatchRow = ({
  title,
  items,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetail,
}: {
  title: string;
  items: Product[];
  cart: CartItem[];
  onAddToCart: (id: number, qty: number) => void;
  onRemoveFromCart: (id: number) => void;
  onOpenDetail: (p: Product) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(items[0]?.id || null);

  const scrollToCenter = (card: HTMLElement) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const centerPoint =
      card.offsetLeft - container.clientWidth / 2 + card.offsetWidth / 2;
    container.scrollTo({ left: centerPoint, behavior: "smooth" });
  };

  const handleCardClick = (id: number, e: React.MouseEvent) => {
    if (activeId === id) {
      onOpenDetail(items.find((p) => p.id === id)!);
    } else {
      scrollToCenter(e.currentTarget as HTMLElement);
    }
  };

  const handleScrollArrow = (dir: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const centerPoint = container.scrollLeft + container.clientWidth / 2;
      const cards = Array.from(
        container.querySelectorAll(".card"),
      ) as HTMLElement[];

      let closest: HTMLElement | null = null;
      let minDiff = Infinity;

      for (const card of cards) {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const diff = Math.abs(centerPoint - center);
        if (diff < minDiff) {
          minDiff = diff;
          closest = card;
        }
      }

      if (closest) {
        const idStr = closest.getAttribute("data-id");
        if (idStr) {
          setActiveId(Number(idStr));
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="match-row">
      <div className="row-label">{title}</div>
      <button
        className="scroll-arrow left"
        onClick={() => handleScrollArrow(-1)}
      >
        <ChevronLeft />
      </button>

      <div className="scroll-area" ref={scrollRef}>
        {items.map((p) => {
          const isInCart = cart.some((i) => i.id === p.id);
          return (
            <div
              key={p.id}
              data-id={p.id}
              className={`card ${activeId === p.id ? "active" : ""} ${isInCart ? "selected" : ""}`}
              onClick={(e) => handleCardClick(p.id, e)}
            >
              <div className="img-box">
                <img src={p.img} alt={p.name} />
              </div>

              <button
                className="cart-btn-mini"
                onClick={(e) => {
                  e.stopPropagation();
                  isInCart ? onRemoveFromCart(p.id) : onAddToCart(p.id, 1);
                }}
              >
                {isInCart ? <Check size={18} /> : <Plus size={18} />}
              </button>

              <div className="info-box">
                <div className="p-name">{p.name}</div>
                <div className="p-price">₩{p.price.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="scroll-arrow right"
        onClick={() => handleScrollArrow(1)}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default App;
