import { Schema, Document, Model } from "mongoose";
import conn from "../conn";
import slugify from "slugify";

export interface IGenre {
  name: string,
  slug: string,
  thumbnail: string,
  icon: string,
}

export interface IGenreGenre extends IGenre, Document {

}

const GenreSchema: Schema<IGenreGenre> = new Schema<IGenreGenre>(
  {
    name: String,
    slug: { type: String, unique: true },
    thumbnail: String,
    icon: String,
  },
  {
    timestamps: true,
    methods: {

    }
  }
);

GenreSchema.pre("save", async function () {
  if (!this.slug) {
    let slug: string = slugify(this.name);
    const count = await Genre.countDocuments({ slug: new RegExp(slug, "i") });
    if (count > 0) slug = slug + "-" + count;
    this.slug = slug.toLowerCase();
  }
})

export const Genre: Model<IGenreGenre> = conn.model<IGenreGenre>("Genre", GenreSchema);