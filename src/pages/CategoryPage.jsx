// @ts-check
import { useParams } from "react-router-dom";
import CategoryProducts from "../components/organisms/CategoryProducts/CategoryProducts";

export default function CategoryPage() {
  const { categoryId } = useParams();
  return <CategoryProducts categoryId={categoryId} />;
}
