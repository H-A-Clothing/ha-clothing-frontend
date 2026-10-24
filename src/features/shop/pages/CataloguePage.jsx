import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { CATEGORIES } from "../../../api/mocks/catalogue.mock";
import CatalogueBrowser from "../components/CatalogueBrowser";
import "../shop.css";

// One page serves /shop, /shop/:category, /new-arrivals, /bestsellers and /sale.
const VARIANTS = {
  all: { title: ["All", "Clothing"], intro: "An intentional study in tactile silhouettes, fluid silks and tailoring cut for the modern wardrobe." },
  new: { title: ["New", "Arrivals"], intro: "The latest pieces from our current capsule, released in limited drops.", query: { collection: "new" } },
  bestsellers: { title: ["Our", "Bestsellers"], intro: "The pieces our clients return to, season after season.", query: { collection: "bestsellers" } },
  sale: { title: ["The", "Sale"], intro: "Selected pieces from past capsules, now at reduced prices.", query: { collection: "sale" } },
};

function splitLabel(label) {
  const words = label.split(" ");
  return [words.slice(0, -1).join(" "), words.at(-1)];
}

export default function CataloguePage({ variant = "all" }) {
  const { category } = useParams();
  const categoryInfo = CATEGORIES.find((c) => c.slug === category);

  const config = category
    ? {
        title: splitLabel(categoryInfo?.label ?? category),
        intro: categoryInfo?.note ? `${categoryInfo.note}, crafted in limited numbers.` : "",
        query: { category },
      }
    : VARIANTS[variant];

  const [plain, italic] = config.title;
  const crumbLabel = `${plain} ${italic}`.trim();

  return (
    <div className="page">
      <CatalogueBrowser
        key={category ?? variant}
        baseQuery={config.query}
        header={({ total }) => (
          <div className="container catalogue-header">
            <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: crumbLabel }]} />
            <div className="catalogue-header__title">
              <h1 className="page-title">
                {plain} <em>{italic}</em>
              </h1>
              {total !== undefined && <span className="tag">{total} styles</span>}
            </div>
            {config.intro && <p className="muted catalogue-header__intro">{config.intro}</p>}
          </div>
        )}
      />
    </div>
  );
}
