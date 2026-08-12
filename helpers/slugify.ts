import { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface ISlugOptions {
  from: string;
  to?: string;
}

export const slugPlugin = <T extends Document>(
  schema: Schema<T>,
  options: ISlugOptions
): void => {
  const { from, to = "slug" } = options;

  schema.pre("save", async function () {
    const sourceValue = this.get(from);

    if (this.isModified(from) && typeof sourceValue === "string") {
      const generatedSlug = slugify(sourceValue, {
        lower: true,
        strict: true,
        locale: "vi",
      });

      this.set(to, generatedSlug);
    }
  });
};