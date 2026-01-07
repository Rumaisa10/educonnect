import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { Category } from "@/model/category-model";

export async function getCategories() {
  const categories = await Category.find({}).lean();
  return replaceMongoIdInArray(categories);
}
export async function getCategoryDetails(categoryId) {
  const category = await Category.findById(categoryId).lean();
  return replaceMongoIdInObject(category);
}
