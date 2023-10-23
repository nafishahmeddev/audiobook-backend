import mongoose, { Schema, Document, Model } from "mongoose";
import conn from "../conn";
import { Album, IAlbum } from "./Album";
import slugify from "slugify";

export interface ITrack {
  title: string,
  excerpt: string,
  description: string,
  slug: string,
  language: string,
  thumbnail: string,
  audio: string,
  duration: string,
  authors: mongoose.ObjectId[],
  genres: mongoose.ObjectId[]
  album: mongoose.ObjectId | IAlbum
}

export interface ITrackModel extends ITrack, Document {
  // You can add custom methods or fields specific to the model here if needed
  generateSlug(): Promise<string>
}

const TrackSchema: Schema<ITrackModel> = new Schema<ITrackModel>(
  {
    title: String,
    excerpt: String,
    description: String,
    slug: { type: String, unique: true },
    language: String,
    thumbnail: String,
    audio: String,
    duration: Number,
    authors: [mongoose.Types.ObjectId],
    genres: [mongoose.Types.ObjectId],
    album: {
      type: mongoose.Types.ObjectId,
      ref: Album
    }
  },
  {
    timestamps: true,
    // You can define any custom methods or other configurations here if needed
    methods: {
      generateSlug: async function () {
        let slug: string = slugify(this.title);
        const count = await Track.countDocuments({ slug: new RegExp(slug, "i") });
        if (count > 0) slug = slug + "-" + count;
        this.slug = slug.toLowerCase();
        return slug;
      }
    }
  }
);

export const Track: Model<ITrackModel> = conn.model<ITrackModel>("Track", TrackSchema);