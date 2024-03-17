import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

export interface IList {
  name: string,
  subtitle: string,
  thumbnail: string,
  thumbnailUrl?: string,
  icon: string,
  position: number,
  slug: string
}

export interface IListList extends IList, Document {

}

const ListSchema: Schema<IListList> = new Schema<IListList>(
  {
    name: String,
    subtitle: String,
    thumbnail: String,
    thumbnailUrl: String,
    icon: String,
    position: { type: Number, default: 0 },
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
    methods: {

    }
  }
);

ListSchema.pre("save", async function () {
  if (!this.slug) {
    let slug: string = slugify(this.name, { remove: /[*+~.()'"!:@]/g, lower: true });
    const count = await List.countDocuments({ slug: new RegExp(slug, "i") });
    if (count > 0) slug = slug + "-" + count;
    this.slug = slug.toLowerCase();
  }
  this.thumbnailUrl = `${process.env.PUBLIC_URL}${this.thumbnail}`
})

export const List: Model<IListList> = mongoose.model<IListList>("List", ListSchema);