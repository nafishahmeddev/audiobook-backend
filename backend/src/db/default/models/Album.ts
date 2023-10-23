import mongoose, { Schema, Document, Model } from "mongoose";
import conn from "../conn";
import { Author } from "./Author";
import { Genre } from "./Genre";
import { List } from "./List";
import { ALBUM_TYPE_ENUM } from "../../../enums/album";
import slugify from "slugify";

export interface IAlbum {
  title: string,
  excerpt: string,
  description: string,
  slug: string
  language : string,
  totalTracks: number,
  thumbnail: string,
  duration: string,
  authors: mongoose.ObjectId[],
  genres: mongoose.ObjectId[],
  lists: mongoose.ObjectId[],
  type: "BOOK" | "PODCAST" | "SONGS"
}

export interface IAlbumModel extends IAlbum, Document {
  // You can add custom methods or fields specific to the model here if needed
  generateSlug(): Promise<string>
}

const AlbumSchema: Schema<IAlbumModel> = new Schema<IAlbumModel>(
  {
    title: String,
    excerpt: String,
    description: String,
    slug: {type: String, unique: true},
    language : String,
    totalTracks: Number,
    thumbnail: String,
    duration: Number,
    authors: {type: [mongoose.Types.ObjectId], ref: Author},
    genres: {type: [mongoose.Types.ObjectId], ref: Genre},
    lists: {type: [mongoose.Types.ObjectId], ref: List},
    type:{type: String, enum: Object.values(ALBUM_TYPE_ENUM)}
  },
  {
    timestamps: true,
    // You can define any custom methods or other configurations here if needed
    methods: {
      generateSlug: async function (){
        let slug : string = slugify(this.title);
        const count = await Album.countDocuments({slug: new RegExp(slug, "i")});
        if(count > 0) slug = slug+"-"+count;
        this.slug = slug.toLowerCase();
        return slug;
      }
    }
  }
);

export const Album: Model<IAlbumModel> = conn.model<IAlbumModel>("Album", AlbumSchema);