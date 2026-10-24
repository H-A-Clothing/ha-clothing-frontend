import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Icon from "../../../components/Icon";
import { CATEGORIES } from "../../../api/mocks/catalogue.mock";
import CatalogueBrowser from "../components/CatalogueBrowser";
import "../shop.css";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [input, setInput] = useState(query);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const submit = (event) => {
    event.preventDefault();
    setSearchParams(input.trim() ? { q: input.trim() } : {});
  };

  const empty = (
    <div className="empty-state">
      <h3>No results for “{query}”</h3>
      <p className="muted">Check the spelling, remove some filters, or explore a category instead.</p>
      <div className="chip-row chip-row--center">
        {CATEGORIES.map((category) => (
          <Link key={category.slug} to={`/shop/${category.slug}`} className="chip">
            {category.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="page">
      <CatalogueBrowser
        empty={empty}
        header={({ total }) => (
          <div className="search-hero">
            <div className="container">
              <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Search" }]} />
              <div className="search-hero__row">
                <div>
                  {total !== undefined && query && (
                    <span className="eyebrow">{total} pieces discovered</span>
                  )}
                  <h1 className="page-title">
                    {query ? (
                      <>
                        Results for <em>“{query}”</em>
                      </>
                    ) : (
                      <>
                        Search the <em>Collection</em>
                      </>
                    )}
                  </h1>
                </div>
                <form className="search-box" onSubmit={submit} role="search">
                  <Icon name="search" size={18} />
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Search by name, fabric or category"
                    aria-label="Search products"
                  />
                  {input && (
                    <button type="button" className="icon-btn" aria-label="Clear search" onClick={() => setInput("")}>
                      <Icon name="close" size={16} />
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
