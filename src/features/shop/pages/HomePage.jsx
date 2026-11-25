import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/Icon";
import { getCategories } from "../../../api/catalogue";
import { useFetch } from "../../../hooks/useFetch";
import AboutStatement from "../components/AboutStatement";
import HeroSlider from "../components/HeroSlider";
import ProductGrid from "../components/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import "../shop.css";

const EDIT_TABS = [
  { label: "All Products", category: undefined },
  { label: "Tops", category: "tops" },
  { label: "Dresses", category: "dresses" },
  { label: "Bottoms", category: "skirts-trousers" },
];

const VALUES = [
  { icon: "scissors", title: "Ethical Craftsmanship", text: "Each piece is cut and finished in small batches." },
  { icon: "truck", title: "Express Courier", text: "Complimentary delivery on orders over LKR 15,000." },
  { icon: "leaf", title: "Conscious Packaging", text: "Plastic-free, reusable garment boxes." },
];

export default function HomePage() {
  const [tab, setTab] = useState(EDIT_TABS[0]);
  const { data: categories } = useFetch(getCategories, []);
  const { data: weekly, loading } = useProducts({ category: tab.category, sort: "newest", limit: 4 });

  return (
    <div className="home">
      <HeroSlider />

      <section className="container home-section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Shop by category</span>
            <h2>Wardrobe Architectures</h2>
          </div>
          <Link to="/shop" className="link-underline">
            View all <Icon name="arrowRight" size={12} />
          </Link>
        </div>
        <div className="category-grid">
          {categories?.map((category) => (
            <Link key={category.slug} to={`/shop/${category.slug}`} className="category-card">
              <div className="category-card__media" />
              <div className="category-card__body">
                <div>
                  <h3>{category.label}</h3>
                  <span className="eyebrow">{category.count} styles available</span>
                </div>
                <Icon name="arrowUpRight" size={18} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container home-section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Capsule release</span>
            <h2>The Weekly Edit</h2>
          </div>
          <div className="tabs" role="tablist">
            {EDIT_TABS.map((item) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={tab === item}
                className={`tab${tab === item ? " is-active" : ""}`}
                onClick={() => setTab(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <ProductGrid products={weekly?.items} loading={loading} columns={4} skeletonCount={4} />
      </section>

      <AboutStatement />

      <section className="container home-section manifesto">
        <div>
          <span className="eyebrow">Atelier manifesto</span>
          <blockquote className="manifesto__quote">
            “Femininity meets refined structure, designed in limited drops to celebrate individuality.”
          </blockquote>
        </div>
        <div className="manifesto__values">
          {VALUES.map((value) => (
            <div key={value.title} className="value-card card">
              <Icon name={value.icon} size={20} />
              <h4>{value.title}</h4>
              <p className="muted">{value.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
