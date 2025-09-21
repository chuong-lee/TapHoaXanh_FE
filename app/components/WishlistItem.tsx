import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { Button } from "react-bootstrap";

type Product = {
  id: number;
  name: string;
  price: number;
  slug: string;
  images: string;
  discount: number;
  description: string;
  brand?: string | { name: string };
  rating?: number;
  category?: {
    id: number;
    name: string;
  };
  categoryId?: number;
};

interface WishlistItemProps {
  product: Product;
  onRemove: (productId: number) => void;
}

function fixImgSrc(img: string) {
  if (!img) return "/images/placeholder.jpg";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  if (img.startsWith("client/images/")) return "/" + img;
  return "/images/products/" + img;
}

export default function WishlistItem({ product, onRemove }: WishlistItemProps) {
  const router = useRouter();

  const handleViewDetail = () => {
    if (product) {
      router.push(`/product/${product.slug}`);
    } else {
      alert("Không tìm thấy sản phẩm!");
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(product.id);
  };

  return (
    <div
      className="product-card position-relative"
      style={{
        border: "1.5px solid #f3f3f3",
        borderRadius: 16,
        padding: 18,
        background: "#fff",
        minHeight: 340,
      }}
    >
      <Button
        className="position-absolute"
        style={{
          top: "8px",
          right: "8px",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleRemove}
      >
        <FaTimes size={18} color="#dc3545" />
      </Button>
      <div className="text-center mb-2">
        <Image
          src={fixImgSrc(product.images)}
          alt={product.name}
          width={120}
          height={120}
          style={{
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      </div>
      <div className="text-center">
        <h6
          className="mb-2"
          style={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.4,
            height: "2.8em",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </h6>
        <div className="mb-2">
          <span className="fw-bold text-danger me-2" style={{ fontSize: 18 }}>
            {product.price && product.discount !== undefined
              ? (product.price * (1 - product.discount / 100)).toLocaleString()
              : product.price?.toLocaleString() || "0"}{" "}
            VNĐ
          </span>
          <span className="text-muted text-decoration-line-through small">
            {product.price?.toLocaleString() || "0"} VNĐ
          </span>
        </div>
        <Button
          variant="success"
          size="sm"
          className="w-100"
          onClick={handleViewDetail}
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}
