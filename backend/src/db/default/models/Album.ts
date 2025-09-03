import mongoose, { Schema, Document, Model } from "mongoose";
import conn from "../conn";
import { Author } from "./Author";
import { Genre } from "./Genre";
import { List } from "./List";
import slugify from "slugify";

export enum AlbumType {
  BOOK = "Book",
  PODCAST = "Podcast",
  ALBUM = "Album"
}

export interface IAlbum {
  title: string,
  excerpt: string,
  description: string,
  slug: string
  language: string,
  totalTracks: number,
  thumbnail: string,
  thumbnailUrl?: string,
  duration: string,
  authors: mongoose.ObjectId[],
  genres: mongoose.ObjectId[],
  lists: mongoose.ObjectId[],
  type: AlbumType
}

export interface IAlbumModel extends IAlbum, Document {
  generateUrls(): IAlbumModel
}

const AlbumSchema: Schema<IAlbumModel> = new Schema<IAlbumModel>(
  {
    title: String,
    excerpt: String,
    description: String,
    slug: { type: String, unique: true },
    language: String,
    totalTracks: Number,
    thumbnail: String,
    thumbnailUrl: String,
    duration: Number,
    authors: { type: [mongoose.Types.ObjectId], ref: Author },
    genres: { type: [mongoose.Types.ObjectId], ref: Genre },
    lists: { type: [mongoose.Types.ObjectId], ref: List },
    type: { type: String, enum: Object.values(AlbumType) }
  },
  {
    timestamps: true,
    // You can define any custom methods or other configurations here if needed
    methods: {
      generateUrls: function () {
        this.thumbnail = this.thumbnail ? process.env.PUBLIC_URL + this.thumbnail : "";
        return this;
      }
    }
  }
);

AlbumSchema.pre("save", async function () {
  if (!this.slug) {
    let slug: string = slugify(this.title, { remove: /[*+~.()'"!:@]/g, lower: true });
    const count = await Album.countDocuments({ slug: new RegExp(slug, "i") });
    if (count > 0) slug = slug + "-" + count;
    this.slug = slug.toLowerCase();
  }
  this.thumbnailUrl = `${process.env.PUBLIC_URL}${this.thumbnail}`
})

export const Album: Model<IAlbumModel> = conn.model<IAlbumModel>("Album", AlbumSchema);