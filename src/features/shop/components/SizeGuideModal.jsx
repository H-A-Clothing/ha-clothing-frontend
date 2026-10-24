import { useEffect } from "react";
import Icon from "../../../components/Icon";

const ROWS = [
  { size: "XS", uk: 6, bust: 80, waist: 62, hips: 88 },
  { size: "S", uk: 8, bust: 84, waist: 66, hips: 92 },
  { size: "M", uk: 10, bust: 88, waist: 70, hips: 96 },
  { size: "L", uk: 12, bust: 93, waist: 75, hips: 101 },
  { size: "XL", uk: 14, bust: 98, waist: 80, hips: 106 },
];

export default function SizeGuideModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__head">
          <div>
            <span className="eyebrow">Fit & Measurements</span>
            <h2 id="size-guide-title">
              Size <em>Guide</em>
            </h2>
          </div>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <table className="size-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>UK</th>
              <th>Bust (cm)</th>
              <th>Waist (cm)</th>
              <th>Hips (cm)</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.size}>
                <td>{row.size}</td>
                <td>{row.uk}</td>
                <td>{row.bust}</td>
                <td>{row.waist}</td>
                <td>{row.hips}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted modal__note">
          Measure around the fullest part of your bust and hips, and the narrowest part of your waist. If you
          are between sizes, choose the larger size for a relaxed fit.
        </p>
      </div>
    </div>
  );
}
