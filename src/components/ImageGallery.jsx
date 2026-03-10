import { useState } from "react";
import T from "../utils/tokens";

export default function ImageGallery({ images: rawImages }) {
  const images = Array.isArray(rawImages) ? rawImages : (rawImages ? [rawImages] : []);
  const [active, setActive] = useState(0);
  if (!images || images.length === 0) {
    return (
      <div style={{ border: `1px dashed ${T.border}`, borderRadius: 8, padding: 24, textAlign: "center", color: T.faint, fontSize: 12.5 }}>暂无图片</div>
    );
  }
  return (
    <div>
      <div style={{ borderRadius: 8, overflow: "hidden", background: "#000", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
        <img src={images[active]} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      </div>
      {images.length > 1 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {images.map((img, i) => (
            <div key={i} onClick={() => setActive(i)} style={{ width: 52, height: 52, borderRadius: 5, overflow: "hidden", cursor: "pointer", border: `2px solid ${i === active ? T.teal : "transparent"}` }}>
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
