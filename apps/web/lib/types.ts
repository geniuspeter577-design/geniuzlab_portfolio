// Single source of truth lives in packages/shared — re-exported here so
// existing "@/lib/types" imports across apps/web keep working.
export type {
  CategorySlug,
  CategoryMeta,
  Project,
  ProjectImage,
} from "@geniuzlab/shared";
